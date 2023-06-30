import type { NextFunction, Request, Response } from 'express';

function fileUploadMiddleware(request: Request, response: Response, next: NextFunction) {
  console.log('fileUploadMiddleware');
  next();
}
