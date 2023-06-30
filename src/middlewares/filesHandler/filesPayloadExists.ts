import { NextFunction, Request, Response } from 'express';
import expressFileUpload from 'express-fileupload';

function filesPayloadExistsMiddleware(request: Request, response: Response, next: NextFunction) {
  const { files } = request; // files: expressFileUpload.FileArray | null | undefined
  if (!files) {
    response.status(400).json({ message: 'No files in request' });
    return;
  }

  next();
}

export { filesPayloadExistsMiddleware };
