import type { Request } from 'express';
import type { Types } from 'mongoose';
import { UserRoles } from '../user';

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
 * -RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body.
 * - This is the type signature of the transformed request object after the verifyJWT middleware is executed. All subsequent middleware and controller functions will have access to the decoded JWT (which is the userInfo object) from verifyJWT middleware.
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

export type {
  LoginUserRequest,
  RefreshTokenRequest,
  LogoutUserRequest,
  RequestAfterJWTVerification,
  AccessTokenDecoded,
  RefreshTokenDecoded,
};
