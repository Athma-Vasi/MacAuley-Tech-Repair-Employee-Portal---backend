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
