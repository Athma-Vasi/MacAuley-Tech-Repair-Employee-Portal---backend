/**
 * This barrel file is used to import/export display router, model, types, controllers and services
 */

/**
 * Imports
 */
import { displayRouter } from "./display.routes";
import { DisplayModel } from "./display.model";

import {
  createNewDisplayBulkController,
  createNewDisplayController,
  deleteADisplayController,
  deleteAllDisplaysController,
  getDisplayByIdController,
  getQueriedDisplaysController,
  updateDisplayByIdController,
  updateDisplaysBulkController,
} from "./display.controller";

import {
  createNewDisplayService,
  deleteADisplayService,
  deleteAllDisplaysService,
  getDisplayByIdService,
  getQueriedDisplaysService,
  getQueriedTotalDisplaysService,
  returnAllDisplaysUploadedFileIdsService,
  updateDisplayByIdService,
} from "./display.service";

import type { DisplayDocument, DisplaySchema } from "./display.model";
import type {
  CreateNewDisplayBulkRequest,
  CreateNewDisplayRequest,
  DeleteADisplayRequest,
  DeleteAllDisplaysRequest,
  GetDisplayByIdRequest,
  GetQueriedDisplaysRequest,
  UpdateDisplayByIdRequest,
  UpdateDisplaysBulkRequest,
} from "./display.types";

/**
 * Exports
 */

export {
  DisplayModel,
  displayRouter,
  createNewDisplayBulkController,
  createNewDisplayController,
  createNewDisplayService,
  deleteADisplayController,
  deleteADisplayService,
  deleteAllDisplaysController,
  deleteAllDisplaysService,
  getDisplayByIdController,
  getDisplayByIdService,
  getQueriedDisplaysController,
  getQueriedDisplaysService,
  getQueriedTotalDisplaysService,
  returnAllDisplaysUploadedFileIdsService,
  updateDisplayByIdController,
  updateDisplayByIdService,
  updateDisplaysBulkController,
};

export type {
  DisplayDocument,
  DisplaySchema,
  CreateNewDisplayBulkRequest,
  CreateNewDisplayRequest,
  DeleteADisplayRequest,
  DeleteAllDisplaysRequest,
  GetDisplayByIdRequest,
  GetQueriedDisplaysRequest,
  UpdateDisplayByIdRequest,
  UpdateDisplaysBulkRequest,
};
