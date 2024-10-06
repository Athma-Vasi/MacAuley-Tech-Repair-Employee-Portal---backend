import jwt from "jsonwebtoken";

import type { Response } from "express";

import { config } from "../../config";

import { Model } from "mongoose";
import { ACCESS_TOKEN_EXPIRES_IN, HASH_SALT_ROUNDS } from "../../constants";
import {
  createNewResourceService,
  getResourceByFieldService,
  getResourceByIdService,
  updateResourceByIdService,
} from "../../services";
import {
  CreateNewResourceRequest,
  DBRecord,
  DecodedToken,
  HttpResult,
  LoginUserRequest,
  RequestAfterJWTVerification,
} from "../../types";
import {
  compareHashedStringWithPlainStringSafe,
  createErrorLogSchema,
  createHttpResultError,
  createHttpResultSuccess,
  hashStringSafe,
  verifyJWTSafe,
} from "../../utils";
import { ErrorLogModel } from "../errorLog";
import { UserDocument, UserModel, UserSchema } from "../user";
import { AuthSchema } from "./auth.model";

/**
 * @description implements 'Refresh Token Rotation' as defined in the OAuth 2.0 RFC
 * @see https://www.rfc-editor.org/rfc/rfc6749#:~:text=refresh%20token%0A%20%20%20rotation
 * - implements 'Automatic Reuse Detection' by keeping track of a token's 'refresh token family' in the Auth document per session
 * @see https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/#:~:text=Refresh%20Token%20Automatic%20Reuse%20Detection
 */

// @desc   Login user
// @route  POST /auth/login
// @access Public
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
      console.group("loginUserHandler");
      console.log("request.body", request.body);
      console.groupEnd();

      const { schema } = request.body;
      const { username, password } = schema;

      const getUserResult = await getResourceByFieldService({
        filter: { username },
        model: UserModel,
      });

      if (getUserResult.err) {
        await createNewResourceService(
          createErrorLogSchema(getUserResult.val, request.body),
          ErrorLogModel,
        );

        response.status(200).json(
          createHttpResultError({
            message: "Unable to get user. Please try again!",
          }),
        );
        return;
      }

      const userDocument = getUserResult.safeUnwrap().data as
        | UserDocument
        | undefined;

      if (userDocument === undefined || userDocument === null) {
        response.status(200).json(
          createHttpResultError({ status: 404, message: "User not found" }),
        );
        return;
      }

      const isPasswordCorrectResult =
        await compareHashedStringWithPlainStringSafe({
          hashedString: userDocument.password,
          plainString: password,
        });

      if (isPasswordCorrectResult.err) {
        await createNewResourceService(
          createErrorLogSchema(isPasswordCorrectResult.val, request.body),
          ErrorLogModel,
        );

        response.status(200).json(
          createHttpResultError({ status: 401, message: "Password incorrect" }),
        );
        return;
      }

      const { ACCESS_TOKEN_SEED } = config;

      const authSessionSchema: AuthSchema = {
        addressIP: request.ip ?? "",
        // user will be required to log in their session again after 1 day
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
        isValid: true,
        userAgent: request.get("User-Agent") ?? "",
        userId: userDocument._id,
        username: userDocument.username,
      };

      const createAuthSessionResult = await createNewResourceService(
        authSessionSchema,
        model,
      );

      if (createAuthSessionResult.err) {
        await createNewResourceService(
          createErrorLogSchema(createAuthSessionResult.val, request.body),
          ErrorLogModel,
        );

        response.status(200).json(
          createHttpResultError({
            message: "Unable to create session. Please try again!",
          }),
        );
        return;
      }

      const sessionId = createAuthSessionResult.safeUnwrap().data?._id;

      if (!sessionId) {
        response.status(200).json(
          createHttpResultError({
            message: "Unable to create session. Please try again!",
          }),
        );
        return;
      }

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
        { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
      );

      const userDocPartial = Object.entries(userDocument).reduce(
        (userDocAcc, [key, value]) => {
          if (key === "password" || key === "paymentInformation") {
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
          data: [userDocPartial],
        }),
      );
    } catch (error: unknown) {
      await createNewResourceService(
        createErrorLogSchema(
          error,
          request.body,
        ),
        ErrorLogModel,
      );

      response.status(200).json(createHttpResultError({}));
    }
  };
}

// @desc   Register user
// @route  POST /auth/register
// @access Public
function registerUserHandler<
  Doc extends DBRecord = DBRecord,
>(
  model: Model<Doc>,
) {
  return async (
    request: CreateNewResourceRequest<UserSchema>,
    response: Response,
  ) => {
    try {
      const { schema } = request.body;
      const { username, password } = schema;

      const getUserResult = await getResourceByFieldService({
        filter: { username },
        model,
      });

      if (getUserResult.err) {
        await createNewResourceService(
          createErrorLogSchema(getUserResult.val, request.body),
          ErrorLogModel,
        );

        response.status(200).json(
          createHttpResultError({
            message: "Unable to register. Please try again.",
          }),
        );
        return;
      }

      const unwrappedResult = getUserResult.safeUnwrap();

      if (unwrappedResult.kind === "success") {
        response.status(200).json(
          createHttpResultError({ message: "Username already exists" }),
        );
        return;
      }

      const hashPasswordResult = await hashStringSafe({
        saltRounds: HASH_SALT_ROUNDS,
        stringToHash: password,
      });

      if (hashPasswordResult.err) {
        await createNewResourceService(
          createErrorLogSchema(hashPasswordResult.val, request.body),
          ErrorLogModel,
        );

        response.status(200).json(
          createHttpResultError({
            message: "Unable to register. Please try again.",
          }),
        );
        return;
      }

      const hashedPassword = hashPasswordResult.safeUnwrap().data;
      const userSchema = {
        ...schema,
        password: hashedPassword,
      };

      const createUserResult = await createNewResourceService(
        userSchema,
        model,
      );

      if (createUserResult.err) {
        await createNewResourceService(
          createErrorLogSchema(createUserResult.val, request.body),
          ErrorLogModel,
        );

        response.status(200).json(
          createHttpResultError({
            message: "Unable to register. Please try again.",
          }),
        );
        return;
      }

      response.status(200).json(
        createHttpResultSuccess({
          accessToken: "",
          message: "User registered successfully",
        }),
      );
    } catch (error: unknown) {
      await createNewResourceService(
        createErrorLogSchema(
          error,
          request.body,
        ),
        ErrorLogModel,
      );

      response.status(200).json(createHttpResultError({}));
    }
  };
}

// @desc   Logout user
// @route  POST /auth/logout
// @access Private
function logoutUserHandler<
  Doc extends DBRecord = DBRecord,
>(
  model: Model<Doc>,
) {
  return async (
    request: RequestAfterJWTVerification,
    response: Response,
  ) => {
    try {
      const { accessToken } = request.body;

      if (!accessToken) {
        response.status(200).json(
          createHttpResultError({ triggerLogout: true }),
        );

        return;
      }

      const { ACCESS_TOKEN_SEED } = config;

      const verifyAccessTokenResult = await verifyJWTSafe({
        seed: ACCESS_TOKEN_SEED,
        token: accessToken,
      });

      if (verifyAccessTokenResult.err) {
        response.status(200).json(
          createHttpResultError({ triggerLogout: true }),
        );

        return;
      }

      const accessTokenDecoded = verifyAccessTokenResult.safeUnwrap().data as
        | DecodedToken
        | undefined;

      if (accessTokenDecoded === undefined) {
        response.status(200).json(
          createHttpResultError({ triggerLogout: true }),
        );

        return;
      }

      const sessionId = accessTokenDecoded.sessionId;

      const getAuthSessionResult = await getResourceByIdService(
        sessionId.toString(),
        model,
      );

      if (getAuthSessionResult.err) {
        await createNewResourceService(
          createErrorLogSchema(getAuthSessionResult.val, request.body),
          ErrorLogModel,
        );

        response.status(200).json(
          createHttpResultError({ triggerLogout: true }),
        );

        return;
      }

      const existingSession = getAuthSessionResult.safeUnwrap().data as
        | AuthSchema
        | undefined;

      if (existingSession === undefined) {
        response.status(200).json(
          createHttpResultError({ triggerLogout: true }),
        );

        return;
      }

      // check if token has already been invalidated

      if (!existingSession.isValid) {
        response.status(200).json(
          createHttpResultError({ triggerLogout: true }),
        );

        return;
      }

      // invalidate session
      const updateSessionResult = await updateResourceByIdService({
        fields: { isValid: false },
        model,
        resourceId: sessionId.toString(),
        updateOperator: "$set",
      });

      if (updateSessionResult.err) {
        await createNewResourceService(
          createErrorLogSchema(updateSessionResult.val, request.body),
          ErrorLogModel,
        );

        response.status(200).json(
          createHttpResultError({ triggerLogout: true }),
        );

        return;
      }

      response.status(200).json(
        createHttpResultSuccess({
          accessToken: "",
          triggerLogout: true,
        }),
      );
    } catch (error: unknown) {
      await createNewResourceService(
        createErrorLogSchema(
          error,
          request.body,
        ),
        ErrorLogModel,
      );

      response.status(200).json(
        createHttpResultError({ triggerLogout: true }),
      );
    }
  };
}

export { loginUserHandler, logoutUserHandler, registerUserHandler };
