/**
 * This index file is used to import/export fileUpload model, router, types, handlers and services
 */

/**
 * Imports
 */

import { FileUploadModel } from './fileUpload.model';
import { fileUploadRouter } from './fileUpload.routes';
import {
  createNewFileUploadHandler,
  deleteAFileUploadHandler,
  deleteAllFileUploadsHandler,
  getAllFileUploadsHandler,
  getFileUploadByIdHandler,
  getFileUploadsByUserHandler,
  insertAssociatedResourceDocumentIdHandler,
} from './fileUpload.controller';
import {
  createNewFileUploadService,
  deleteAllFileUploadsService,
  deleteFileUploadByIdService,
  getAllFileUploadsService,
  getFileUploadByIdService,
  getFileUploadsByUserService,
  insertAssociatedResourceDocumentIdService,
  deleteAllFileUploadsByAssociatedResourceService,
} from './fileUpload.service';

import type {
  FileUploadDocument,
  FileUploadSchema,
  AssociatedResourceKind,
  FileExtension,
} from './fileUpload.model';
import type {
  CreateNewFileUploadRequest,
  DeleteAFileUploadRequest,
  DeleteAllFileUploadsRequest,
  FileUploadServerResponse,
  GetAllFileUploadsRequest,
  GetFileUploadByIdRequest,
  GetFileUploadsByUserRequest,
  InsertAssociatedDocumentIdRequest,
} from './fileUpload.types';

/**
 * Exports
 */

export {
  FileUploadModel,
  fileUploadRouter,
  createNewFileUploadHandler,
  deleteAFileUploadHandler,
  deleteAllFileUploadsHandler,
  getAllFileUploadsHandler,
  getFileUploadByIdHandler,
  getFileUploadsByUserHandler,
  insertAssociatedResourceDocumentIdHandler,
  createNewFileUploadService,
  deleteAllFileUploadsService,
  deleteFileUploadByIdService,
  getAllFileUploadsService,
  getFileUploadByIdService,
  getFileUploadsByUserService,
  insertAssociatedResourceDocumentIdService,
  deleteAllFileUploadsByAssociatedResourceService,
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
