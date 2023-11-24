import bcrypt from 'bcryptjs';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type { LoginUserRequest, LogoutUserRequest, RefreshTokenRequest } from '../auth';

import { config } from '../../config';

import { getUserWithPasswordService } from '../user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenDecoded } from './auth.types';
import {
  createNewAuthSessionService,
  deleteAuthSessionService,
  findSessionByIdService,
  invalidateAllAuthSessionsService,
  updateSessionRefreshTokenDenyListService,
} from './auth.service';
import { AuthSchema } from './auth.model';

/**
 * @description implements 'Refresh Token Rotation' as defined in the OAuth 2.0 RFC to mitigate 'replay attacks'
 * @see https://www.rfc-editor.org/rfc/rfc6749#:~:text=refresh%20token%0A%20%20%20rotation
 * - implements 'Automatic Reuse Detection' by keeping track of a token's 'refresh token family' in the Auth document per session
 * @see https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/#:~:text=Refresh%20Token%20Automatic%20Reuse%20Detection
 */

// @desc Login user
// @route POST /auth/login
// @access Public
const loginUserHandler = expressAsyncHandler(
  async (request: LoginUserRequest, response: Response) => {
    const { username, password } = request.body;

    // confirm that username and password are not empty
    if (!username || !password) {
      response.status(400).json({ message: 'Username and password are required' });
      return;
    }

    // find user
    const foundUser = await getUserWithPasswordService(username);
    if (!foundUser) {
      response.status(404).json({ message: 'User not found' });
      return;
    }

    // check if user is active
    if (!foundUser.active) {
      response.status(401).json({ message: 'User is not active' });
      return;
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordCorrect) {
      response.status(400).json({ message: 'Password is incorrect' });
      return;
    }

    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = config;

    // create new auth session
    const authSessionSchema: AuthSchema = {
      expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // user will be required to log in their session again after 1 day
      userId: foundUser._id,
      username: foundUser.username,
      refreshTokensDenyList: [],
    };
    const newAuthSession = await createNewAuthSessionService(authSessionSchema);
    if (!newAuthSession) {
      response.status(500).json({ message: 'Internal server error' });
      return;
    }

    // grab session id from auth session document
    const sessionId = newAuthSession._id;

    // uuid for refresh token jti that will be stored in refreshTokensDenyList field in Auth session document when the /refresh endpoint is called
    const refreshTokenJti = uuidv4();
    console.log({ sessionId, refreshTokenJti });
    // create refresh token
    const refreshToken = jwt.sign(
      {
        userInfo: {
          userId: foundUser._id,
          username: foundUser.username,
          roles: foundUser.roles,
        },
        sessionId,
      },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1800s', // 30 minutes
        jwtid: refreshTokenJti,
      }
    );

    // create secure cookie with refresh token
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 30, // cookie expires in 30 minutes
    });

    // create access token
    const accessToken = jwt.sign(
      {
        userInfo: {
          userId: foundUser._id,
          username: foundUser.username,
          roles: foundUser.roles,
        },
        sessionId,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' }
    );

    const userDocWithoutPassword = Object.entries(foundUser).reduce((userDocAcc, [key, value]) => {
      if (key === 'password' || key === '__v') {
        return userDocAcc;
      }
      userDocAcc[key] = value;

      return userDocAcc;
    }, Object.create(null));

    // send access token in response
    response
      .status(200)
      .json({ message: 'Login successful', accessToken, userDocument: userDocWithoutPassword });
  }
);

// @desc Refresh token
// @route POST /auth/refresh
// @access Private
const refreshTokenHandler = expressAsyncHandler(
  async (request: RefreshTokenRequest, response: Response) => {
    const { refreshToken } = request.cookies;
    const { sessionId: sessionIdFromReqBody } = request.body;

    // check if refresh token exists
    if (!refreshToken) {
      // if refresh token does not exist, delete session
      await deleteAuthSessionService(sessionIdFromReqBody);

      response.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      response.status(401).json({ message: 'Unauthorized: Refresh token is required' });
      return;
    }

    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = config;
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (error: VerifyErrors | null, decoded) => {
      if (error) {
        // if error, delete session
        await deleteAuthSessionService(sessionIdFromReqBody);

        response.clearCookie('refreshToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });

        response.status(401).json({ message: 'Unauthorized: Error decoding token' });
        return;
      }

      const {
        userInfo: { userId, roles, username },
        sessionId,
        jti,
      } = decoded as RefreshTokenDecoded;
      // check if decoded refresh token has sessionId and jti
      console.log('refresh token decoded', decoded);
      if (!sessionId || !jti) {
        response.status(403).json({ message: 'Forbidden - Invalid refresh token' });
        return;
      }

      // check if session exists
      const existingSession = await findSessionByIdService(sessionId);
      if (!existingSession) {
        response.clearCookie('refreshToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });

        response.status(401).json({ message: 'Unauthorized: Session not found' });
        return;
      }

      // check if refresh token is in deny list
      const isRefreshTokenInDenyList = existingSession.refreshTokensDenyList.includes(jti);
      if (isRefreshTokenInDenyList) {
        // assumed to be a 'replay / person-in-middle attack' - invalidate all sessions
        await invalidateAllAuthSessionsService(userId);

        response.clearCookie('refreshToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });
        response.status(401).json({ message: 'Unauthorized: Refresh token is invalid' });

        return;
      }

      // if refresh token has not been used and session exists,
      // add old refresh token jti to deny list
      await updateSessionRefreshTokenDenyListService({
        sessionId,
        refreshTokenJwtId: jti,
      });

      // create new refresh token jti
      const newRefreshTokenJti = uuidv4();
      // create refresh token
      const newRefreshToken = jwt.sign(
        {
          userInfo: {
            userId,
            username,
            roles,
          },
          sessionId,
        },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: '1800s', // 30 minutes
          jwtid: newRefreshTokenJti,
        }
      );

      // create secure cookie with refresh token
      response.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 30, // cookie expires in 30 minutes
      });

      // create access token
      const newAccessToken = jwt.sign(
        {
          userInfo: {
            userId,
            username,
            roles,
          },
          sessionId,
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '60s' }
      );

      // send access token in response
      response.status(200).json({ accessToken: newAccessToken });
      return;
    });
  }
);

// @desc Logout user
// @route POST /auth/logout
// @access Private
const logoutUserHandler = expressAsyncHandler(
  async (request: LogoutUserRequest, response: Response) => {
    const { refreshToken } = request.cookies;

    // check if refresh token exists
    if (!refreshToken) {
      response.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      response.status(204).json({ message: 'No content' });
      return;
    }

    // verify refresh token
    const { REFRESH_TOKEN_SECRET } = config;
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (error, decoded) => {
      if (error) {
        response.clearCookie('refreshToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });

        response.status(204).json({ message: 'No content' });
        return;
      }

      // check if decoded refresh token has sessionId and jwtid
      const { jti, sessionId } = decoded as RefreshTokenDecoded;
      if (!sessionId || !jti) {
        response.clearCookie('refreshToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });

        response.status(204).json({ message: 'No content' });
        return;
      }

      // invalidate session
      const userWithDeletedSession = await deleteAuthSessionService(sessionId);
      console.log('user with deleted session', userWithDeletedSession);

      response.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      response.status(200).json({ message: 'User logged out' });
      return;
    });
  }
);

export { loginUserHandler, refreshTokenHandler, logoutUserHandler };
