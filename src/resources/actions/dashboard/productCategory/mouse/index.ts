/**
 * This barrel file is used to import/export mouse router, model, types, controllers and services
 */

/**
 * Imports
 */
import { mouseRouter } from './mouse.routes';
import { MouseModel } from './mouse.model';

import {
  createNewMouseBulkHandler,
  createNewMouseHandler,
  deleteAMouseHandler,
  deleteAllMousesHandler,
  getMouseByIdHandler,
  getQueriedMousesHandler,
  returnAllFileUploadsForMousesHandler,
  updateMouseByIdHandler,
} from './mouse.controller';

import {
  createNewMouseService,
  deleteAllMousesService,
  deleteAMouseService,
  getMouseByIdService,
  getQueriedMousesService,
  getQueriedTotalMousesService,
  returnAllMouseUploadedFileIdsService,
  updateMouseByIdService,
} from './mouse.service';

import type { MouseDocument, MouseSchema } from './mouse.model';
import type {
  CreateNewMouseBulkRequest,
  CreateNewMouseRequest,
  DeleteAMouseRequest,
  DeleteAllMousesRequest,
  GetMouseByIdRequest,
  GetQueriedMousesRequest,
  UpdateMouseByIdRequest,
} from './mouse.types';

/**
 * Exports
 */

export {
  MouseModel,
  mouseRouter,
  createNewMouseBulkHandler,
  createNewMouseHandler,
  createNewMouseService,
  deleteAMouseHandler,
  deleteAllMousesHandler,
  deleteAllMousesService,
  deleteAMouseService,
  getMouseByIdHandler,
  getMouseByIdService,
  getQueriedMousesHandler,
  getQueriedMousesService,
  getQueriedTotalMousesService,
  returnAllMouseUploadedFileIdsService,
  returnAllFileUploadsForMousesHandler,
  updateMouseByIdHandler,
  updateMouseByIdService,
};

export type {
  CreateNewMouseBulkRequest,
  CreateNewMouseRequest,
  DeleteAMouseRequest,
  DeleteAllMousesRequest,
  GetMouseByIdRequest,
  GetQueriedMousesRequest,
  MouseDocument,
  MouseSchema,
  UpdateMouseByIdRequest,
};
