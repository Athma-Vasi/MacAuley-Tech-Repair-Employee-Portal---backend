import type { NextFunction, Request, Response } from 'express';
import { FileExtension } from '../../resources/fileUpload/fileUpload.model';

/**
 * This middleware extracts the file information from the request object and adds it to the request body.
 */
function fileInfoExtracterMiddleware(request: Request, response: Response, next: NextFunction) {
  const files = request.files as
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | Express.Multer.File[];

  // create a new property on the request body called fileUploads and assign it an empty array
  Object.defineProperty(request.body, 'fileUploads', {
    value: [],
    writable: true,
    enumerable: true,
    configurable: true,
  });

  // for each file, extract the file information and push it to the fileUploads array
  Object.entries(files).forEach((file) => {
    const [fileName, fileObject] = file;
    const fileInfoObject = {
      uploadedFile: fileObject,
      fileName,
      fileExtension: fileObject.mimetype.split('/')[1],
      fileSize: fileObject.size,
      fileMimeType: fileObject.mimetype,
      fileEncoding: fileObject.encoding,
    };

    request.body.fileUploads.push(fileInfoObject);
  });

  // delete the files property from the request object
  Object.defineProperty(request, 'files', {
    value: undefined,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  next();
}

export { fileInfoExtracterMiddleware };
