import { NextFunction, Request, Response } from 'express';
import expressFileUpload from 'express-fileupload';
import { FileUploadObject } from '../../types';

const MB = 5; // 5MB
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

function fileSizeLimiterMiddleware(request: Request, response: Response, next: NextFunction) {
  // this middleware only runs if filesPayloadExistsMiddleware has passed - files cannot be undefined

  const files = request.files as unknown as FileUploadObject | FileUploadObject[];
  const filesOverLimit: FileUploadObject[] = [];

  console.log('fileSizeLimiter-files: ', files);

  // determine files over limit
  Object.entries(files).forEach((file) => {
    const [fileName, fileObject] = file;
    if (fileObject.name > FILE_SIZE_LIMIT) {
      filesOverLimit.push(fileObject);
    }
  });

  // if there are files over limit, return error
  if (filesOverLimit.length > 0) {
    const progressiveApostrophe = filesOverLimit.length > 1 ? "'s" : '';
    const properVerb = filesOverLimit.length > 1 ? 'are' : 'is';

    const message = `Upload failed. The following file${progressiveApostrophe}${properVerb} over ${MB}MB: ${filesOverLimit
      .map((file) => file.name)
      .join(', ')}`;

    response.status(413).json({ message }); // 413: Payload Too Large
    return;
  }

  next();
}

export { fileSizeLimiterMiddleware };
