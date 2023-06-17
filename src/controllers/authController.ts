import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';

import { UserModel } from '../models';
import { Request, Response } from 'express';
import { LoginUserRequest, LogoutUserRequest, RefreshTokenRequest } from '../types';
import {
  checkUserExistsService,
  checkUserIsActiveService,
  getUserByIdService,
  getUserByUsernameService,
} from '../services';
import { config } from '../config';

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

    // check if user exists
    const userExists = await checkUserExistsService({ username });
    if (!userExists) {
      response.status(400).json({ message: 'Username does not exist' });
      return;
    }

    // check user is active
    const userIsActive = await checkUserIsActiveService({ username });
    if (!userIsActive) {
      response.status(400).json({ message: 'User is not active' });
      return;
    }

    // find user
    const foundUser = await getUserByUsernameService(username);
    if (!foundUser) {
      response.status(400).json({ message: 'User not found' });
      return;
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordCorrect) {
      response.status(400).json({ message: 'Password is incorrect' });
      return;
    }

    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = config;
    // create access token
    const accessToken = jwt.sign(
      {
        userInfo: {
          userId: foundUser._id,
          username: foundUser.username,
          roles: foundUser.roles,
        },
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // create refresh token
    const refreshToken = jwt.sign({ username: foundUser.username }, REFRESH_TOKEN_SECRET, {
      expiresIn: '1y',
    });

    // create secure cookie with refresh token
    response.cookie('jwt', refreshToken, {
      httpOnly: true, // cookie is only accessible by the server
      secure: true, // cookie is only sent over https
      sameSite: 'none', // cookie is not sent in cross-site requests
      maxAge: 1000 * 60 * 60 * 24, // cookie expires in 1 day
    });

    // send access token in response
    response.status(200).json({ message: 'Login successful', accessToken });
  }
);

// @desc Refresh token
// @route GET /auth/refresh
// @access Public - because access token has expired
const refreshTokenHandler = expressAsyncHandler(
  async (request: RefreshTokenRequest, response: Response) => {
    const { jwt: refreshToken } = request.cookies;

    // check if refresh token exists
    if (!refreshToken) {
      response.status(401).json({ message: 'Unauthorized: Refresh token is required' });
      return;
    }

    const { REFRESH_TOKEN_SECRET } = config;
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (error, decoded) => {
      if (error) {
        response.status(403).json({ message: 'Forbidden' });
        return;
      }

      const { username } = decoded as { username: string };

      // check if user exists
      const userExists = await checkUserExistsService({ username });
      if (!userExists) {
        response.status(401).json({ message: 'Unauthorized: User does not exist' });
        return;
      }

      // check user is active
      const userIsActive = await checkUserIsActiveService({ username });
      if (!userIsActive) {
        response.status(401).json({ message: 'Unauthorized: User is not active' });
        return;
      }

      // find user
      const foundUser = await getUserByUsernameService(username);
      if (!foundUser) {
        response.status(401).json({ message: 'Unauthorized: User not found' });
        return;
      }

      // create access token
      const { ACCESS_TOKEN_SECRET } = config;
      const accessToken = jwt.sign(
        {
          userInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
      );

      // send access token in response
      response.status(200).json({ accessToken });
    });
  }
);

// @desc Logout user
// @route POST /auth/logout
// @access Private
const logoutUserHandler = expressAsyncHandler(
  async (request: LogoutUserRequest, response: Response) => {
    const { jwt: refreshToken } = request.cookies;

    // check if refresh token exists
    if (!refreshToken) {
      response.status(204).json({ message: 'No content' });
      return;
    }

    response.clearCookie('jwt', {
      httpOnly: true, // cookie is only accessible by the server
      secure: true, // cookie is only sent over https
      sameSite: 'none', // cookie is not sent in cross-site requests
    });

    response.status(200).json({ message: 'User logged out' });
  }
);

export { loginUserHandler, refreshTokenHandler, logoutUserHandler };
