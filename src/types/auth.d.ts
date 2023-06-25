import { Request } from 'express';

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
      userId: string;
      username: string;
      roles: string[];
    };
  };
}

export { LoginUserRequest, RefreshTokenRequest, LogoutUserRequest, RequestAfterJWTVerification };
