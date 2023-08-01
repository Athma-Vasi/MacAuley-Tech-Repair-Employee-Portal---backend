import { NextFunction, Request, Response } from 'express';
import { FileUploadObject } from '../../types';

function filesPayloadExistsMiddleware(request: Request, response: Response, next: NextFunction) {
  const files = request.files as FileUploadObject | FileUploadObject[] | undefined;

  console.log('\n');
  console.group('filesPayloadExistsMiddleware');
  console.log({ files });
  console.groupEnd();

  if (!files) {
    response.status(400).json({ message: 'No files in request' });
    return;
  }

  next();
  return;
}

export { filesPayloadExistsMiddleware };
