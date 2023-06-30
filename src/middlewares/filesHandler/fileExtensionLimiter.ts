import path from 'path';

import type { NextFunction, Request, Response } from 'express';

const ALLOWED_FILE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.pdf',
  '.docx',
  '.doc',
  '.xlsx',
  '.xls',
  '.ppt',
  '.pptx',
  '.csv',
  '.txt',
  '.log',
];

const fileExtensionLimiterMiddleware = (allowedExtensionsArray: string[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    // this middleware only runs if filesPayloadExistsMiddleware and fileSizeLimiterMiddleware has passed
    const files = request.files as
      | {
          [fieldname: string]: Express.Multer.File[];
        }
      | Express.Multer.File[];

    const filesWithDisallowedExtensions: Express.Multer.File[] = [];

    Object.entries(files).forEach((file) => {
      const [fileName, fileObject] = file;
      // grab the file extension from the file name
      const fileExtension = path.extname(fileName);
      // if the file extension is not in the allowedExtensionArray, add it to the filesWithDisallowedExtensions array
      if (!allowedExtensionsArray.includes(fileExtension)) {
        filesWithDisallowedExtensions.push(fileObject);
      }
    });

    // if there are files with disallowed extensions, return error
    if (filesWithDisallowedExtensions.length > 0) {
      const progressiveApostrophe = filesWithDisallowedExtensions.length > 1 ? "'s" : '';
      const properVerb = filesWithDisallowedExtensions.length > 1 ? 'are' : 'is';

      const message = `Upload failed. The following file${progressiveApostrophe}${properVerb} not allowed: ${filesWithDisallowedExtensions
        .map((file) => file.filename)
        .join(', ')}. Allowed extensions are: ${allowedExtensionsArray.join(', ')}`;

      response.status(422).json({ message }); // 422: Unprocessable Entity
      return;
    }

    next();
  };
};

export { fileExtensionLimiterMiddleware, ALLOWED_FILE_EXTENSIONS };
