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
    jwt: string;
  };
}

interface LogoutUserRequest extends Request {
  cookies: {
    jwt: string;
  };
}

/**
 * RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body.
 */
/**
 * This is the type signature of the transformed request object after the verifyJWT middleware is executed. All subsequent middleware and controller functions will have access to the decoded JWT (which is the userInfo object) from verifyJWT middleware.
 */
interface RequestAfterJWTVerification extends Request {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
}

export type {
  LoginUserRequest,
  RefreshTokenRequest,
  LogoutUserRequest,
  RequestAfterJWTVerification,
};
