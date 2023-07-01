import expressAsyncHandler from 'express-async-handler';

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
import {
  createNewFileUploadService,
  deleteAllFileUploadsService,
  deleteFileUploadService,
  getAllFileUploadsService,
  getFileUploadByIdService,
  getFileUploadsByUserService,
  insertAssociatedResourceDocumentIdService,
} from './fileUpload.service';

// @desc   Create a new file upload
// @route  POST /file-uploads
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
// @route  PUT /file-uploads/:fileUploadId
// @access Private
const insertAssociatedResourceDocumentIdHandler = expressAsyncHandler(
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

    const oldFileUpload = await getFileUploadByIdService(fileUploadId);
    if (!oldFileUpload) {
      response.status(404).json({
        message: 'File upload not found',
      });
      return;
    }

    // update fileUpload object
    const updatedFileUploadObject = {
      ...oldFileUpload,
      associatedDocumentId,
      associatedResource,
    };

    // update fileUpload
    const updatedFileUpload = await insertAssociatedResourceDocumentIdService(
      updatedFileUploadObject
    );
    if (updatedFileUpload) {
      response.status(200).json({ message: 'File upload updated successfully' });
    } else {
      response.status(400).json({ message: 'File upload could not be updated' });
    }
  }
);

// @desc   Delete a file upload
// @route  DELETE /file-uploads/:fileUploadId
// @access Private
const deleteAFileUploadHandler = expressAsyncHandler(
  async (request: DeleteAFileUploadRequest, response: Response<FileUploadServerResponse>) => {
    const { fileUploadId } = request.params;

    // check if existing fileUpload has an associated document id
    // if it does, do not allow unless the associated document is deleted first (only managers/admin can delete associated documents)
    // users can delete their own file uploads which are not associated with any document

    const existingFileUpload = await getFileUploadByIdService(fileUploadId);
    if (!existingFileUpload) {
      response.status(404).json({
        message: 'File upload not found',
      });
      return;
    }

    // check if file upload is associated with a document
    if (existingFileUpload.associatedDocumentId) {
      response.status(400).json({
        message:
          'File upload is associated with a document. Ensure document(example: ExpenseClaim) is deleted first',
      });
      return;
    }

    // delete file upload
    const deletedResult = await deleteFileUploadService(fileUploadId);
    if (deletedResult.acknowledged) {
      response.status(200).json({ message: 'File upload deleted successfully' });
    } else {
      response.status(400).json({ message: 'File upload could not be deleted' });
    }
  }
);

// @desc   Delete all file uploads
// @route  DELETE /file-uploads
// @access Private/Admin/Manager
const deleteAllFileUploadsHandler = expressAsyncHandler(
  async (request: DeleteAllFileUploadsRequest, response: Response<FileUploadServerResponse>) => {
    const {
      userInfo: { userId, username, roles },
    } = request.body;

    // check if user is admin or manager
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Not authorized as user is not an admin or manager',
      });
      return;
    }

    // delete all file uploads
    const deletedResult = await deleteAllFileUploadsService();
    if (deletedResult.acknowledged) {
      response.status(200).json({ message: 'All file uploads deleted successfully' });
    } else {
      response.status(400).json({ message: 'All file uploads could not be deleted' });
    }
  }
);

// @desc   Get all file uploads
// @route  GET /file-uploads
// @access Private/Admin/Manager
const getAllFileUploadsHandler = expressAsyncHandler(
  async (request: GetAllFileUploadsRequest, response: Response<FileUploadServerResponse>) => {
    const {
      userInfo: { userId, username, roles },
    } = request.body;

    // check if user is admin or manager
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Not authorized as user is not an admin or manager',
      });
      return;
    }

    // get all file uploads
    const allFileUploads = await getAllFileUploadsService();
    if (allFileUploads) {
      response.status(200).json({
        message: 'All file uploads retrieved successfully',
        fileUploads: allFileUploads,
      });
    } else {
      response.status(404).json({ message: 'No file uploads found', fileUploads: [] });
    }
  }
);

// @desc   Get file uploads by user
// @route  GET /file-uploads/user
// @access Private
const getFileUploadsByUserHandler = expressAsyncHandler(
  async (request: GetFileUploadsByUserRequest, response: Response<FileUploadServerResponse>) => {
    // anyone can get their own file uploads
    const {
      userInfo: { userId, username, roles },
    } = request.body;

    // get all file uploads by user
    const fileUploads = await getFileUploadsByUserService(userId);
    if (fileUploads) {
      response.status(200).json({
        message: 'File uploads retrieved successfully',
        fileUploads,
      });
    } else {
      response.status(404).json({ message: 'No file uploads found', fileUploads: [] });
    }
  }
);

// @desc   Get file uploads by its id
// @route  GET /file-uploads/:fileUploadId
// @access Private
const getFileUploadByIdHandler = expressAsyncHandler(
  async (request: GetFileUploadByIdRequest, response: Response<FileUploadServerResponse>) => {
    const { fileUploadId } = request.params;

    // only admin or manager can get file uploads by its id that does not belong to them
    const {
      userInfo: { roles, userId, username },
    } = request.body;

    // check if user is admin or manager
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Not authorized as user is not an admin or manager',
      });
      return;
    }

    // get file upload by its id
    const fileUpload = await getFileUploadByIdService(fileUploadId);
    if (fileUpload) {
      response.status(200).json({
        message: 'File upload retrieved successfully',
        fileUploads: [fileUpload],
      });
    } else {
      response.status(404).json({ message: 'No file upload found', fileUploads: [] });
    }
  }
);

export {
  createNewFileUploadHandler,
  deleteAFileUploadHandler,
  insertAssociatedResourceDocumentIdHandler,
  deleteAllFileUploadsHandler,
  getAllFileUploadsHandler,
  getFileUploadsByUserHandler,
  getFileUploadByIdHandler,
};
