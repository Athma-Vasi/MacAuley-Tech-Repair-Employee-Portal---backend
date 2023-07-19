import path from 'path';

import type { NextFunction, Request, Response } from 'express';
import { FileUploadObject } from '../../types';

// creates a closure that takes in an array of allowed file extensions and returns a middleware function
const fileExtensionLimiterMiddleware = (allowedExtensionsArray: string[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    // this middleware only runs if filesPayloadExistsMiddleware and fileSizeLimiterMiddleware has passed - files cannot be undefined
    const files = request.files as unknown as FileUploadObject | FileUploadObject[];

    const filesWithDisallowedExtensions: FileUploadObject[] = [];

    console.log('fileExtensionLimiter-files: ', files);

    Object.entries(files).forEach((file: [string, FileUploadObject]) => {
      const [_, fileObj] = file;
      // grab the file extension from the file name
      const fileExtension = path.extname(fileObj.name);
      // if the file extension is not in the allowedExtensionArray, add it to the filesWithDisallowedExtensions array
      if (!allowedExtensionsArray.includes(fileExtension)) {
        filesWithDisallowedExtensions.push(fileObj);
      }
    });

    console.log(
      'fileExtensionLimiter-filesWithDisallowedExtensions: ',
      filesWithDisallowedExtensions
    );

    // if there are files with disallowed extensions, return error
    if (filesWithDisallowedExtensions.length > 0) {
      const progressiveApostrophe = filesWithDisallowedExtensions.length > 1 ? "'s" : ' ';
      const properVerb = filesWithDisallowedExtensions.length > 1 ? ' are' : 'is';

      const message = `Upload failed. The following file ${progressiveApostrophe}${properVerb} not allowed: ${filesWithDisallowedExtensions
        .map((file) => file.name)
        .join(', ')}. Allowed extensions are: ${allowedExtensionsArray.join(', ')}`;

      response.status(422).json({ message }); // 422: Unprocessable Entity
      return;
    }

    next();
  };
};

export { fileExtensionLimiterMiddleware };
