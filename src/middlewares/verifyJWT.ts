import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config';
import { RequestAfterJWTVerification } from '../types';

function verifyJWTMiddleware(
  // technically this request is only modified after this middleware function runs
  request: RequestAfterJWTVerification,
  response: Response,
  next: NextFunction
) {
  const { ACCESS_TOKEN_SECRET } = config;

  console.log('request.headers.authorization', request.headers.authorization);

  const token = request.headers.authorization?.split(' ')[1];
  if (!token) {
    response.status(401).json({ message: 'No token provided' });
    return;
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      response.status(403).json({ message: 'Forbidden' });
      return;
    }

    const { userInfo } = decoded as {
      userInfo: { username: string; roles: ('Admin' | 'Employee' | 'Manager')[] };
    };
    request.body.userInfo = userInfo;

    next();
  });
}

export { verifyJWTMiddleware };
