import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import type { RequestAfterJWTVerification } from '../resources/auth';
import type { UserRoles } from '../resources/user';
import type { Types } from 'mongoose';

import { config } from '../config';

function verifyJWTMiddleware(
  // technically this request is only modified after this middleware function runs
  request: RequestAfterJWTVerification,
  response: Response,
  next: NextFunction
) {
  const { ACCESS_TOKEN_SECRET } = config;

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
      userInfo: { username: string; userId: Types.ObjectId; roles: UserRoles };
    };

    request.body.userInfo = userInfo;

    next();
    return;
  });
}

export { verifyJWTMiddleware };
