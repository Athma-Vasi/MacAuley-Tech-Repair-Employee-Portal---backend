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
  deleteFileUploadByIdService,
  getQueriedFileUploadsService,
  getFileUploadByIdService,
  getQueriedFileUploadsByUserService,
  insertAssociatedResourceDocumentIdService,
  getQueriedTotalFileUploadsService,
} from './fileUpload.service';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
} from '../../types';
import { FileUploadDocument } from './fileUpload.model';
import { FilterQuery, QueryOptions } from 'mongoose';

// @desc   Create a new file upload
// @route  POST /file-uploads
// @access Private
const createNewFileUploadHandler = expressAsyncHandler(
  async (request: CreateNewFileUploadRequest, response: Response<FileUploadServerResponse>) => {
    const {
      userInfo: { userId, username },
      fileUploads,
    } = request.body;

    const { uploadedFile, fileEncoding, fileExtension, fileMimeType, fileName, fileSize } =
      fileUploads[0];

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
      response
        .status(201)
        .json({ message: 'File uploaded successfully', documentId: newFileUpload._id });
    } else {
      response.status(400).json({ message: 'File could not be uploaded' });
    }
  }
);

// @desc   Get all file uploads
// @route  GET /file-uploads
// @access Private/Admin/Manager
const getAllFileUploadsHandler = expressAsyncHandler(
  async (
    request: GetAllFileUploadsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalFileUploadsService({
        filter: filter as FilterQuery<FileUploadDocument> | undefined,
      });
    }

    // get all file uploads
    const fileUploads = await getQueriedFileUploadsService({
      filter: filter as FilterQuery<FileUploadDocument> | undefined,
      projection: projection as QueryOptions<FileUploadDocument>,
      options: options as QueryOptions<FileUploadDocument>,
    });
    if (fileUploads.length === 0) {
      response.status(404).json({
        message: 'No file uploads that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found file uploads',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: fileUploads.length,
        resourceData: fileUploads,
      });
    }
  }
);

// @desc   Get file uploads by user
// @route  GET /file-uploads/user
// @access Private
const getQueriedFileUploadsByUserHandler = expressAsyncHandler(
  async (
    request: GetFileUploadsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // assign userId to filter
    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalFileUploadsService({
        filter: filterWithUserId,
      });
    }

    const fileUploads = await getQueriedFileUploadsByUserService({
      filter: filterWithUserId as FilterQuery<FileUploadDocument> | undefined,
      projection: projection as QueryOptions<FileUploadDocument>,
      options: options as QueryOptions<FileUploadDocument>,
    });
    if (fileUploads.length === 0) {
      response.status(404).json({
        message: 'No file uploads found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'File uploads found successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: fileUploads.length,
        resourceData: fileUploads,
      });
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
    const { fileUploadId, associatedDocumentId, associatedResource } = request.body;

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
    const deletedResult = await deleteFileUploadByIdService(fileUploadId);
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
    // delete all file uploads
    const deletedResult = await deleteAllFileUploadsService();
    if (deletedResult.acknowledged) {
      response.status(200).json({ message: 'All file uploads deleted successfully' });
    } else {
      response.status(400).json({ message: 'All file uploads could not be deleted' });
    }
  }
);

// @desc   Get file uploads by its id
// @route  GET /file-uploads/:fileUploadId
// @access Private
const getFileUploadByIdHandler = expressAsyncHandler(
  async (request: GetFileUploadByIdRequest, response: Response<FileUploadServerResponse>) => {
    const { fileUploadId } = request.params;

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
  getQueriedFileUploadsByUserHandler,
  getFileUploadByIdHandler,
};
