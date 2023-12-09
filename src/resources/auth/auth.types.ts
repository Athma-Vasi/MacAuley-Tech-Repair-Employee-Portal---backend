import type { Request } from "express";
import type { Types } from "mongoose";
import { UserRoles } from "../user";

interface LoginUserRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

interface RefreshTokenRequest extends Request {
  cookies: {
    refreshToken: string;
  };
  body: {
    sessionId: Types.ObjectId;
  };
}

interface LogoutUserRequest extends Request {
  cookies: {
    refreshToken: string;
  };
  body: {
    sessionId: Types.ObjectId;
  };
}

type AccessTokenDecoded = {
  userInfo: {
    userId: Types.ObjectId;
    username: string;
    roles: UserRoles;
  };
  sessionId: Types.ObjectId;
  iat: number;
  exp: number;
};

type RefreshTokenDecoded = {
  userInfo: {
    userId: Types.ObjectId;
    username: string;
    roles: UserRoles;
  };
  sessionId: Types.ObjectId;
  iat: number;
  exp: number;
  jti: string;
};

/**
 * - RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWTMiddleware to the request body.
 * - This is the type signature of the transformed request object after the verifyJWTMiddleware is executed.
 * - All routes' (except user, customer registration POST) subsequent middleware and controller functions will have access to the decoded JWT.
 */
interface RequestAfterJWTVerification extends Request {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
}

/**
 * - RequestAfterJWTVerificationWithQuery is an Union type of RequestAfterJWTVerification and Request types.
 * - It is the shape of the Express Request object after assignQueryDefaults middleware runs.
 * - verifyJWTMiddleware => verifyRoles => assignQueryDefaults => controller function
 * - Typically used in GET requests (all requests routes for some resources).
 * - Query object fields are used in service functions: ${resource}Model.find(filter, projection, options) method.
 */
type RequestAfterJWTVerificationWithQuery = RequestAfterJWTVerification & {
  body: {
    newQueryFlag: boolean;
    totalDocuments: number;
  };
  query: {
    filter: Record<string, string | number | boolean | Record<string, any>>;
    projection: string | string[] | Record<string, any>;
    options: Record<string, string | number | boolean | Record<string, any>>;
  };
};

export type {
  AccessTokenDecoded,
  LoginUserRequest,
  LogoutUserRequest,
  RefreshTokenDecoded,
  RefreshTokenRequest,
  RequestAfterJWTVerification,
  RequestAfterJWTVerificationWithQuery,
};
