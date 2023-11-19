/**
 * This barrel file is used to import/export display router, model, types, controllers and services
 */

/**
 * Imports
 */
import { displayRouter } from './display.routes';
import { DisplayModel } from './display.model';

import {
  createNewDisplayBulkHandler,
  createNewDisplayHandler,
  deleteADisplayHandler,
  deleteAllDisplaysHandler,
  getDisplayByIdHandler,
  getQueriedDisplaysHandler,
  returnAllFileUploadsForDisplaysHandler,
  updateDisplayByIdHandler,
} from './display.controller';

import {
  createNewDisplayService,
  deleteAllDisplaysService,
  deleteADisplayService,
  getDisplayByIdService,
  getQueriedDisplaysService,
  getQueriedTotalDisplaysService,
  returnAllDisplaysUploadedFileIdsService,
  updateDisplayByIdService,
} from './display.service';

import type { DisplayDocument, DisplaySchema } from './display.model';
import type {
  CreateNewDisplayBulkRequest,
  CreateNewDisplayRequest,
  DeleteADisplayRequest,
  DeleteAllDisplaysRequest,
  GetDisplayByIdRequest,
  GetQueriedDisplaysRequest,
  UpdateDisplayByIdRequest,
} from './display.types';

/**
 * Exports
 */

export {
  DisplayModel,
  displayRouter,
  createNewDisplayBulkHandler,
  createNewDisplayHandler,
  createNewDisplayService,
  deleteADisplayHandler,
  deleteAllDisplaysHandler,
  deleteAllDisplaysService,
  deleteADisplayService,
  getDisplayByIdHandler,
  getDisplayByIdService,
  getQueriedDisplaysHandler,
  getQueriedDisplaysService,
  getQueriedTotalDisplaysService,
  returnAllDisplaysUploadedFileIdsService,
  returnAllFileUploadsForDisplaysHandler,
  updateDisplayByIdHandler,
  updateDisplayByIdService,
};

export type {
  CreateNewDisplayBulkRequest,
  CreateNewDisplayRequest,
  DeleteADisplayRequest,
  DeleteAllDisplaysRequest,
  GetDisplayByIdRequest,
  GetQueriedDisplaysRequest,
  DisplayDocument,
  DisplaySchema,
  UpdateDisplayByIdRequest,
};
