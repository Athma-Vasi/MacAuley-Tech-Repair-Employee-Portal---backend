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

export type {
  AccessTokenDecoded,
  LoginUserRequest,
  LogoutUserRequest,
  RefreshTokenDecoded,
  RefreshTokenRequest,
};
