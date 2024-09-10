import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import type { CookieOptions, Response } from "express";
import type { LoginUserRequest, LogoutUserRequest } from ".";

import { config } from "../../config";

import { v4 as uuidv4 } from "uuid";
import { TokenDecoded } from "./auth.types";
import { AuthModel, AuthSchema } from "./auth.model";
import { Model } from "mongoose";
import { DBRecord, HttpResult } from "../../types";
import { createNewErrorLogService } from "../errorLog";
import {
  createErrorLogSchema,
  createHttpResultError,
  createHttpResultSuccess,
  verifyJWTSafe,
} from "../../utils";
import {
  createNewResourceService,
  getResourceByFieldService,
  getResourceByIdService,
  updateResourceByIdService,
} from "../../services";
import { UserDocument } from "../user";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../../constants";

/**
 * @description implements 'Refresh Token Rotation' as defined in the OAuth 2.0 RFC
 * @see https://www.rfc-editor.org/rfc/rfc6749#:~:text=refresh%20token%0A%20%20%20rotation
 * - implements 'Automatic Reuse Detection' by keeping track of a token's 'refresh token family' in the Auth document per session
 * @see https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/#:~:text=Refresh%20Token%20Automatic%20Reuse%20Detection
 */

// @desc Login user
// @route POST /auth/login
// // @access Public
function loginUserHandler<
  Doc extends DBRecord = DBRecord,
>(
  model: Model<Doc>,
) {
  return async (
    request: LoginUserRequest,
    response: Response<
      HttpResult<{ userDocument: UserDocument; accessToken: string }>
    >,
  ) => {
    try {
      const { schema } = request.body;
      const { username, password } = schema;

      const getUserResult = await getResourceByFieldService({
        filter: { username },
        model,
      });

      if (getUserResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(getUserResult.val, request.body),
        );

        response.status(200).json(createHttpResultError({ accessToken: "" }));
        return;
      }

      const hashedPassword = getUserResult.safeUnwrap().data?.password ?? "";

      const isPasswordCorrect = bcrypt.compare(
        password,
        hashedPassword as string,
      );

      if (!isPasswordCorrect) {
        response.status(200).json(createHttpResultError({ accessToken: "" }));
        return;
      }

      const { ACCESS_TOKEN_SEED, REFRESH_TOKEN_SEED } = config;
      const userDocument = getUserResult.safeUnwrap().data as
        | UserDocument
        | undefined;

      if (userDocument === undefined || userDocument === null) {
        response.status(200).json(createHttpResultError({ accessToken: "" }));
        return;
      }

      const authSessionSchema: AuthSchema = {
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // user will be required to log in their session again after 7 days
        userId: userDocument._id,
        username: userDocument.username,
        tokensDenyList: [],
      };

      const createAuthSessionResult = await createNewResourceService(
        authSessionSchema,
        AuthModel,
      );

      if (createAuthSessionResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(createAuthSessionResult.val, request.body),
        );

        response.status(200).json(createHttpResultError({ accessToken: "" }));
        return;
      }

      const sessionId = createAuthSessionResult.safeUnwrap().data?._id;

      // uuid for refresh token jti that will be stored in refreshTokensDenyList field in Auth session document
      // when the /refresh endpoint is called
      const tokenJwtId = uuidv4();

      const refreshToken = jwt.sign(
        {
          userInfo: {
            userId: userDocument._id,
            username: userDocument.username,
            roles: userDocument.roles,
          },
          sessionId,
        },
        REFRESH_TOKEN_SEED,
        {
          expiresIn: REFRESH_TOKEN_EXPIRES_IN,
          jwtid: tokenJwtId,
        },
      );

      response.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 12, // cookie expires in 12 hours
      });

      const accessToken = jwt.sign(
        {
          userInfo: {
            userId: userDocument._id,
            username: userDocument.username,
            roles: userDocument.roles,
          },
          sessionId,
        },
        ACCESS_TOKEN_SEED,
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN, jwtid: tokenJwtId },
      );

      const userDocWithoutPassword = Object.entries(userDocument).reduce(
        (userDocAcc, [key, value]) => {
          if (key === "password") {
            return userDocAcc;
          }
          userDocAcc[key] = value;

          return userDocAcc;
        },
        Object.create(null),
      );

      response.status(200).json(
        createHttpResultSuccess({
          accessToken,
          data: [userDocWithoutPassword],
        }),
      );
    } catch (error: unknown) {
      await createNewErrorLogService(
        createErrorLogSchema(
          error,
          request.body,
        ),
      );

      response.status(200).json(createHttpResultError({ accessToken: "" }));
    }
  };
}

// @desc Logout user
// @route POST /auth/logout
// @access Private
function logoutUserHandler<
  Doc extends DBRecord = DBRecord,
>(
  model: Model<Doc>,
) {
  return async (
    request: LogoutUserRequest,
    response: Response,
  ) => {
    try {
      const { accessToken } = request.body;
      const { refreshToken } = request.cookies;

      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      };

      if (!accessToken || !refreshToken) {
        response.clearCookie("refreshToken", cookieOptions);
        response.status(200).json(
          createHttpResultError({ accessToken: "", triggerLogout: true }),
        );

        return;
      }

      const { ACCESS_TOKEN_SEED, REFRESH_TOKEN_SEED } = config;

      const verifyAccessTokenResult = await verifyJWTSafe({
        seed: ACCESS_TOKEN_SEED,
        token: accessToken,
      });

      if (verifyAccessTokenResult.err) {
        response.clearCookie("refreshToken", cookieOptions);
        response.status(200).json(
          createHttpResultError({ accessToken: "", triggerLogout: true }),
        );

        return;
      }

      const verifyRefreshTokenResult = await verifyJWTSafe({
        seed: REFRESH_TOKEN_SEED,
        token: refreshToken,
      });

      if (verifyRefreshTokenResult.err) {
        response.clearCookie("refreshToken", cookieOptions);
        response.status(200).json(
          createHttpResultError({ accessToken: "", triggerLogout: true }),
        );

        return;
      }

      const refreshTokenDecoded = verifyRefreshTokenResult.safeUnwrap()
        .data as TokenDecoded | undefined;

      if (refreshTokenDecoded === undefined) {
        response.clearCookie("refreshToken", cookieOptions);
        response.status(200).json(
          createHttpResultError({ accessToken: "", triggerLogout: true }),
        );

        return;
      }

      const sessionId = refreshTokenDecoded.sessionId;

      // check if tokens are in deny list
      const getAuthSessionResult = await getResourceByIdService(
        sessionId.toString(),
        model,
      );

      if (getAuthSessionResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(getAuthSessionResult.val, request.body),
        );

        response.clearCookie("refreshToken", cookieOptions);
        response.status(200).json(
          createHttpResultError({ accessToken: "", triggerLogout: true }),
        );

        return;
      }

      const existingSession = getAuthSessionResult.safeUnwrap().data as
        | AuthSchema
        | undefined;

      if (existingSession === undefined) {
        response.clearCookie("refreshToken", cookieOptions);
        response.status(200).json(
          createHttpResultError({ accessToken: "", triggerLogout: true }),
        );

        return;
      }

      // both tokens share the same jti
      const isEitherTokenInDenyList = existingSession.tokensDenyList.includes(
        refreshTokenDecoded.jti,
      );

      if (isEitherTokenInDenyList) {
        response.clearCookie("refreshToken", cookieOptions);
        response.status(200).json(
          createHttpResultError({ accessToken: "", triggerLogout: true }),
        );

        return;
      }

      // add token jti to deny list
      const updateSessionResult = await updateResourceByIdService({
        fields: {
          tokensDenyList: [refreshTokenDecoded.jti],
        },
        model: AuthModel,
        resourceId: sessionId.toString(),
        updateOperator: "$push",
      });

      if (updateSessionResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(updateSessionResult.val, request.body),
        );

        response.clearCookie("refreshToken", cookieOptions);
        response.status(200).json(
          createHttpResultError({ accessToken: "", triggerLogout: true }),
        );

        return;
      }

      response.clearCookie("refreshToken", cookieOptions);
      response.status(200).json(
        createHttpResultSuccess({ accessToken: "", triggerLogout: true }),
      );
    } catch (error: unknown) {
      await createNewErrorLogService(
        createErrorLogSchema(
          error,
          request.body,
        ),
      );

      response.status(200).json(
        createHttpResultError({ accessToken: "", triggerLogout: true }),
      );
    }
  };
}

export { loginUserHandler, logoutUserHandler };

// const refreshTokenController = expressAsyncController(
//   async (
//     request: RefreshTokenRequest,
//     response: Response,
//     next: NextFunction,
//   ) => {
//     const { refreshToken } = request.cookies;
//     const { sessionId: sessionIdFromReqBody } = request.body;

//     if (!refreshToken) {
//       await deleteAuthSessionService(sessionIdFromReqBody);

//       response.clearCookie("refreshToken", {
//         httpOnly: true,
//         secure: true,
//         sameSite: "none",
//       });

//       return next(new createHttpError.Unauthorized("Unauthorized"));
//     }

//     const { ACCESS_TOKEN_SEED, REFRESH_TOKEN_SEED } = config;
//     jwt.verify(
//       refreshToken,
//       REFRESH_TOKEN_SEED,
//       async (error: VerifyErrors | null, decoded) => {
//         if (error) {
//           await deleteAuthSessionService(sessionIdFromReqBody);

//           response.clearCookie("refreshToken", {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none",
//           });

//           return next(new createHttpError.Unauthorized("Unauthorized"));
//         }

//         const {
//           userInfo: { userId, roles, username },
//           sessionId,
//           jti,
//         } = decoded as TokenDecoded;

//         console.log("refresh token decoded", decoded);

//         if (!sessionId || !jti) {
//           await deleteAuthSessionService(sessionIdFromReqBody);

//           response.clearCookie("refreshToken", {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none",
//           });

//           return next(new createHttpError.Unauthorized("Unauthorized"));
//         }

//         const existingSession = await findSessionByIdService(sessionId);
//         if (!existingSession) {
//           response.clearCookie("refreshToken", {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none",
//           });

//           return next(new createHttpError.Unauthorized("Unauthorized"));
//         }

//         const isRefreshTokenInDenyList = existingSession.refreshTokensDenyList
//           .includes(jti);
//         if (isRefreshTokenInDenyList) {
//           // assumed to be a 'replay / person-in-middle attack' - invalidate all sessions
//           await invalidateAllAuthSessionsService(userId);

//           response.clearCookie("refreshToken", {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none",
//           });

//           return next(new createHttpError.Unauthorized("Unauthorized"));
//         }

//         // if refresh token has not been used and session exists,
//         // add old refresh token jti to deny list
//         await updateSessionRefreshTokenDenyListService({
//           sessionId,
//           refreshTokenJwtId: jti,
//         });

//         const newRefreshTokenJti = uuidv4();

//         const newRefreshToken = jwt.sign(
//           {
//             userInfo: {
//               userId,
//               username,
//               roles,
//             },
//             sessionId,
//           },
//           REFRESH_TOKEN_SEED,
//           {
//             expiresIn: "1800s", // 30 minutes
//             jwtid: newRefreshTokenJti,
//           },
//         );

//         // create secure cookie with refresh token
//         response.cookie("refreshToken", newRefreshToken, {
//           httpOnly: true,
//           secure: true,
//           sameSite: "none",
//           maxAge: 1000 * 60 * 30, // cookie expires in 30 minutes
//         });

//         const newAccessToken = jwt.sign(
//           {
//             userInfo: {
//               userId,
//               username,
//               roles,
//             },
//             sessionId,
//           },
//           ACCESS_TOKEN_SEED,
//           { expiresIn: "60s" },
//         );

//         response.status(200).json({ accessToken: newAccessToken });
//         return;
//       },
//     );
//   },
// );
