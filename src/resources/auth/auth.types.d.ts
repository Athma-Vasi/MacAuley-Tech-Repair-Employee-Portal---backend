import { Request } from 'express';
import { Types } from 'mongoose';

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
      roles: string[];
    };
  };
}

export { LoginUserRequest, RefreshTokenRequest, LogoutUserRequest, RequestAfterJWTVerification };
