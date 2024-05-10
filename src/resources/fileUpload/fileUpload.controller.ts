import expressAsyncController from "express-async-handler";

import type { NextFunction, Response } from "express";
import type {
  CreateNewFileUploadRequest,
  InsertAssociatedDocumentIdRequest,
  DeleteAFileUploadRequest,
  DeleteAllFileUploadsRequest,
  FileUploadServerResponse,
  GetAllFileUploadsRequest,
  GetFileUploadByIdRequest,
  GetFileUploadsByUserRequest,
} from "./fileUpload.types";
import {
  createNewFileUploadService,
  deleteAllFileUploadsService,
  deleteFileUploadByIdService,
  getQueriedFileUploadsService,
  getFileUploadByIdService,
  getQueriedFileUploadsByUserService,
  insertAssociatedResourceDocumentIdService,
  getQueriedTotalFileUploadsService,
} from "./fileUpload.service";
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
} from "../../types";
import { FileUploadDocument, FileUploadSchema } from "./fileUpload.model";
import { FilterQuery, QueryOptions } from "mongoose";
import createHttpError from "http-errors";

// @desc   Create a new file upload
// @route  POST /file-upload
// @access Private
const createNewFileUploadController = expressAsyncController(
  async (
    request: CreateNewFileUploadRequest,
    response: Response<FileUploadServerResponse>,
    next: NextFunction
  ) => {
    const {
      userInfo: { userId, username },
      fileUploadSchema,
    } = request.body;

    const {
      uploadedFile,
      fileEncoding,
      fileExtension,
      fileMimeType,
      fileName,
      fileSize,
    } = fileUploadSchema[0];

    const newFileUploadSchema: FileUploadSchema = {
      userId,
      username,
      uploadedFile,
      fileExtension,
      fileName,
      fileSize,
      fileMimeType,
      fileEncoding,
    };

    const fileUploadDocument: FileUploadDocument = await createNewFileUploadService(
      newFileUploadSchema
    );
    if (!fileUploadDocument) {
      return next(new createHttpError.InternalServerError("File could not be uploaded"));
    }

    response.status(201).json({
      message: "File uploaded successfully",
      documentId: fileUploadDocument._id,
    });
  }
);

// @desc   Get all file uploads
// @route  GET /file-upload
// @access Private/Admin/Manager
const getAllFileUploadsController = expressAsyncController(
  async (
    request: GetAllFileUploadsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalFileUploadsService({
        filter: filter as FilterQuery<FileUploadDocument> | undefined,
      });
    }

    const fileUploads = await getQueriedFileUploadsService({
      filter: filter as FilterQuery<FileUploadDocument> | undefined,
      projection: projection as QueryOptions<FileUploadDocument>,
      options: options as QueryOptions<FileUploadDocument>,
    });

    if (fileUploads.length === 0) {
      response.status(404).json({
        message: "No file uploads found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });

      return;
    }

    response.status(200).json({
      message: "File uploads found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: fileUploads,
    });
  }
);

// @desc   Get file uploads by user
// @route  GET /file-upload/user
// @access Private
const getQueriedFileUploadsByUserController = expressAsyncController(
  async (
    request: GetFileUploadsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<FileUploadDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

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
        message: "No file uploads found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });

      return;
    }

    response.status(200).json({
      message: "File uploads found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: fileUploads,
    });
  }
);

// @desc   Insert associated document id into file upload
// @route  PUT /file-upload/:fileUploadId
// @access Private
const insertAssociatedResourceDocumentIdController = expressAsyncController(
  async (
    request: InsertAssociatedDocumentIdRequest,
    response: Response<FileUploadServerResponse>,
    next: NextFunction
  ) => {
    const { fileUploadId, associatedDocumentId, associatedResource } = request.body;

    const oldFileUpload = await getFileUploadByIdService(fileUploadId);
    if (!oldFileUpload) {
      return next(new createHttpError.NotFound("File upload not found"));
    }

    const updatedFileUploadObject = {
      ...oldFileUpload,
      associatedDocumentId,
      associatedResource,
    };

    const updatedFileUpload = await insertAssociatedResourceDocumentIdService(
      updatedFileUploadObject
    );
    if (!updatedFileUpload) {
      return next(
        new createHttpError.InternalServerError(
          "Associated document id could not be inserted"
        )
      );
    }

    response.status(200).json({
      message: "Associated document id inserted successfully",
      fileUploads: [updatedFileUpload],
    });
  }
);

// @desc   Delete a file upload
// @route  DELETE /file-upload/:fileUploadId
// @access Private
const deleteAFileUploadController = expressAsyncController(
  async (
    request: DeleteAFileUploadRequest,
    response: Response<FileUploadServerResponse>,
    next: NextFunction
  ) => {
    const { fileUploadId } = request.params;

    const existingFileUpload = await getFileUploadByIdService(fileUploadId);
    if (!existingFileUpload) {
      return next(new createHttpError.NotFound("File upload not found"));
    }

    const deletedResult = await deleteFileUploadByIdService(fileUploadId);
    if (deletedResult.deletedCount !== 1) {
      return next(
        new createHttpError.InternalServerError("File upload could not be deleted")
      );
    }

    response.status(200).json({ message: "File upload deleted successfully" });
  }
);

// @desc   Delete all file uploads
// @route  DELETE /file-upload/delete-all
// @access Private/Admin/Manager
const deleteAllFileUploadsController = expressAsyncController(
  async (
    _request: DeleteAllFileUploadsRequest,
    response: Response<FileUploadServerResponse>,
    next: NextFunction
  ) => {
    const deletedResult = await deleteAllFileUploadsService();
    if (deletedResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError("File uploads could not be deleted")
      );
    }

    response.status(200).json({ message: "File uploads deleted successfully" });
  }
);

// @desc   Get file uploads by its id
// @route  GET /file-uploads/:fileUploadId
// @access Private
const getFileUploadByIdController = expressAsyncController(
  async (
    request: GetFileUploadByIdRequest,
    response: Response<FileUploadServerResponse>,
    next: NextFunction
  ) => {
    const { fileUploadId } = request.params;

    const fileUpload = await getFileUploadByIdService(fileUploadId);
    if (!fileUpload) {
      return next(new createHttpError.NotFound("File upload not found"));
    }

    response.status(200).json({
      message: "File upload retrieved successfully",
      fileUploads: [fileUpload],
    });
  }
);

export {
  createNewFileUploadController,
  deleteAFileUploadController,
  insertAssociatedResourceDocumentIdController,
  deleteAllFileUploadsController,
  getAllFileUploadsController,
  getQueriedFileUploadsByUserController,
  getFileUploadByIdController,
};
