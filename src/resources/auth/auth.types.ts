import type { Request } from "express";
import type { Types } from "mongoose";
import { UserRoles } from "../user";

type LoginUserRequest = Request & {
  body: {
    username: string;
    password: string;
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
  TokenDecoded,
};
