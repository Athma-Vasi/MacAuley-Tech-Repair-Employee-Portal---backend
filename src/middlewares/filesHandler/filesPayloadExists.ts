import { NextFunction, Request, Response } from 'express';

function filesPayloadExistsMiddleware(request: Request, response: Response, next: NextFunction) {
  const { files } = request; // Array or dictionary of Multer.File object populated by array(), fields(), and any() middleware.
  if (!files) {
    response.status(400).json({ message: 'No files in request' });
    return;
  }

  next();
}

export { filesPayloadExistsMiddleware };
