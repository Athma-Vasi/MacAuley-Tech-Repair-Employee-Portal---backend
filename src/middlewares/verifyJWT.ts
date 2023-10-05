import { NextFunction, Response, Request } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

import { config } from '../config';
import { AccessTokenDecoded } from '../resources/auth/auth.types';

function verifyJWTMiddleware(
  // technically this request is only modified after this middleware function runs
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { ACCESS_TOKEN_SECRET } = config;

  const accessToken = request.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    response.status(401).json({ message: 'No token provided' });
    return;
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (error: VerifyErrors | null, decoded) => {
    if (error) {
      response.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      response.status(403).json({ message: 'Forbidden - Access token invalid' });
      return;
    }

    const { userInfo, sessionId } = decoded as AccessTokenDecoded;

    const propertyDescriptor: PropertyDescriptor = {
      writable: true,
      enumerable: true,
      configurable: true,
    };

    console.log('original request.body: ', request.body);

    const updatedRequestBody = {
      userInfo,
      sessionId,
    };

    Object.defineProperty(request, 'body', {
      value: { ...request.body, ...updatedRequestBody },
      ...propertyDescriptor,
    });

    console.log('\n');
    console.group('verifyJWTMiddleware');
    console.log('decoded: ', decoded);
    console.log('modified request.body: ', request.body);
    console.groupEnd();

    next();
    return;
  });
}

export { verifyJWTMiddleware };
