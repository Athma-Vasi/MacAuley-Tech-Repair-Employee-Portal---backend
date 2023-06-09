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

export { LoginUserRequest, RefreshTokenRequest, LogoutUserRequest };
