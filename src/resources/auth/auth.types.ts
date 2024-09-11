import type { Request } from "express";
import type { Types } from "mongoose";
import { UserRoles, UserSchema } from "../user";

type LoginUserRequest = Request & {
  body: {
    schema: {
      username: string;
      password: string;
    };
  };
};

type RegisterUserRequest = Request & {
  body: {
    schema: UserSchema;
  };
};

type RefreshTokenRequest = Request & {
  cookies: {
    refreshToken: string;
  };
  body: {
    sessionId: Types.ObjectId;
  };
};

type LogoutUserRequest = Request & {
  cookies: {
    refreshToken: string;
  };
  body: {
    sessionId: Types.ObjectId;
  };
};

type TokenDecoded = {
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

export type {
  LoginUserRequest,
  LogoutUserRequest,
  RefreshTokenRequest,
  RegisterUserRequest,
  TokenDecoded,
};
