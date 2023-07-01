import { NextFunction, Request, Response } from 'express';
import expressFileUpload from 'express-fileupload';
import { FileUploadObject } from '../../types';

function filesPayloadExistsMiddleware(request: Request, response: Response, next: NextFunction) {
  const files = request.files as FileUploadObject | FileUploadObject[] | undefined;

  console.log('filesPayloadExists-files: ', files);

  if (!files) {
    response.status(400).json({ message: 'No files in request' });
    return;
  }

  next();
}

export { filesPayloadExistsMiddleware };
