/**
 * This barrel file is used to import/export fileUpload model, router, types, handlers and services
 */

/**
 * Imports
 */

import { FileUploadModel } from "./fileUpload.model";
import { fileUploadRouter } from "./fileUpload.routes";
import {
  createNewFileUploadController,
  deleteAFileUploadController,
  deleteAllFileUploadsController,
  getAllFileUploadsController,
  getFileUploadByIdController,
  getQueriedFileUploadsByUserController,
  insertAssociatedResourceDocumentIdController,
} from "./fileUpload.controller";
import {
  createNewFileUploadService,
  deleteAllFileUploadsService,
  deleteFileUploadByIdService,
  getQueriedFileUploadsService,
  getFileUploadByIdService,
  getQueriedFileUploadsByUserService,
  insertAssociatedResourceDocumentIdService,
} from "./fileUpload.service";

import type {
  FileUploadDocument,
  FileUploadSchema,
  AssociatedResourceKind,
  FileExtension,
} from "./fileUpload.model";
import type {
  CreateNewFileUploadRequest,
  DeleteAFileUploadRequest,
  DeleteAllFileUploadsRequest,
  FileUploadServerResponse,
  GetAllFileUploadsRequest,
  GetFileUploadByIdRequest,
  GetFileUploadsByUserRequest,
  InsertAssociatedDocumentIdRequest,
} from "./fileUpload.types";

/**
 * Exports
 */

export {
  FileUploadModel,
  fileUploadRouter,
  createNewFileUploadController,
  deleteAFileUploadController,
  deleteAllFileUploadsController,
  getAllFileUploadsController,
  getFileUploadByIdController,
  getQueriedFileUploadsByUserController,
  insertAssociatedResourceDocumentIdController,
  createNewFileUploadService,
  deleteAllFileUploadsService,
  deleteFileUploadByIdService,
  getQueriedFileUploadsService,
  getFileUploadByIdService,
  getQueriedFileUploadsByUserService,
  insertAssociatedResourceDocumentIdService,
};

export type {
  FileUploadDocument,
  FileUploadSchema,
  AssociatedResourceKind,
  FileExtension,
  CreateNewFileUploadRequest,
  DeleteAFileUploadRequest,
  DeleteAllFileUploadsRequest,
  FileUploadServerResponse,
  GetAllFileUploadsRequest,
  GetFileUploadByIdRequest,
  GetFileUploadsByUserRequest,
  InsertAssociatedDocumentIdRequest,
};
