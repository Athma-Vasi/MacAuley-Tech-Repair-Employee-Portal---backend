import type { NextFunction, Request, Response } from 'express';
import { FileExtension } from '../../resources/fileUpload/fileUpload.model';
import { FileUploadObject } from '../../types';

/**
 * This middleware extracts the file information from the request object and adds it to the request body.
 */
function fileInfoExtracterMiddleware(request: Request, response: Response, next: NextFunction) {
  // this middleware only runs if filesPayloadExistsMiddleware, fileSizeLimiterMiddleware, and fileExtensionCheckerMiddleware have passed - files cannot be undefined
  const files = request.files as unknown as FileUploadObject | FileUploadObject[];

  // create a new property on the request body called fileUploads and assign it an empty array
  Object.defineProperty(request.body, 'fileUploads', {
    value: [],
    writable: true,
    enumerable: true,
    configurable: true,
  });

  // for each file, extract the file information and push it to the fileUploads array
  Object.entries(files).forEach((file: [string, FileUploadObject]) => {
    const [_, { data, name, mimetype, size, encoding }] = file;
    const fileInfoObject = {
      uploadedFile: data,
      fileName: name,
      fileExtension: mimetype.split('/')[1],
      fileSize: size,
      fileMimeType: mimetype,
      fileEncoding: encoding,
    };

    request.body.fileUploads.push(fileInfoObject);
  });

  // delete the files property from the request object as it is no longer needed
  Object.defineProperty(request, 'files', {
    value: undefined,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  console.log('\n');
  console.group('fileInfoExtracterMiddleware');
  console.log({ files });
  console.log({ fileUploads: request.body.fileUploads });
  console.groupEnd();

  next();
  return;
}

export { fileInfoExtracterMiddleware };
