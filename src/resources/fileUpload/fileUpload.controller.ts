import expressAsyncHandler from 'express-async-handler';

import { Types } from 'mongoose';
import type { Response } from 'express';
import type {
  CreateNewFileUploadRequest,
  InsertAssociatedDocumentIdRequest,
  DeleteAFileUploadRequest,
  DeleteAllFileUploadsRequest,
  FileUploadServerResponse,
  GetAllFileUploadsRequest,
  GetFileUploadByIdRequest,
  GetFileUploadsByUserRequest,
} from './fileUpload.types';
import { createNewFileUploadService } from './fileUpload.service';

// @desc   Create a new file upload
// @route  POST /file-upload
// @access Private
const createNewFileUploadHandler = expressAsyncHandler(
  async (request: CreateNewFileUploadRequest, response: Response<FileUploadServerResponse>) => {
    const {
      userInfo: { userId, username },
      fileUpload: { uploadedFile, fileExtension, fileName, fileSize, fileMimeType, fileEncoding },
    } = request.body;

    // create new fileUpload object
    const newFileUploadObject = {
      userId,
      username,
      uploadedFile,
      fileExtension,
      fileName,
      fileSize,
      fileMimeType,
      fileEncoding,
    };

    // create new fileUpload
    const newFileUpload = await createNewFileUploadService(newFileUploadObject);
    if (newFileUpload) {
      response.status(201).json({ message: 'File uploaded successfully' });
    } else {
      response.status(400).json({ message: 'File could not be uploaded' });
    }
  }
);

// @desc   Insert associated document id into file upload
// @route  PUT /file-upload/:fileUploadId
// @access Private
const insertAssociatedDocumentIdHandler = expressAsyncHandler(
  async (
    request: InsertAssociatedDocumentIdRequest,
    response: Response<FileUploadServerResponse>
  ) => {
    const {
      userInfo: { userId, username },
      fileUploadId,
      associatedDocumentId,
      associatedResource,
    } = request.body;
  }
);

export { createNewFileUploadHandler };
