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

  console.log('fileInfoExtracter-files: ', files);

  // for each file, extract the file information and push it to the fileUploads array
  Object.entries(files).forEach((file: [string, FileUploadObject]) => {
    const [FileObjKey, fileObject] = file;
    const fileInfoObject = {
      uploadedFile: fileObject.data,
      fileName: fileObject.name,
      fileExtension: fileObject.mimetype.split('/')[1],
      fileSize: fileObject.size,
      fileMimeType: fileObject.mimetype,
      fileEncoding: fileObject.encoding,
    };

    request.body.fileUploads.push(fileInfoObject);
    console.log('fileInfoExtracter-fileObject', fileObject);
  });

  // // delete the files property from the request object
  // Object.defineProperty(request, 'files', {
  //   value: undefined,
  //   writable: true,
  //   enumerable: true,
  //   configurable: true,
  // });

  next();
}

export { fileInfoExtracterMiddleware };
