/**
 * This barrel file is used to import/export keyboard router, model, types, controllers and services
 */

/**
 * Imports
 */
import { keyboardRouter } from "./keyboard.routes";
import { KeyboardModel } from "./keyboard.model";

import {
  createNewKeyboardBulkController,
  createNewKeyboardController,
  deleteAKeyboardController,
  deleteAllKeyboardsController,
  getKeyboardByIdController,
  getQueriedKeyboardsController,
  updateKeyboardByIdController,
  updateKeyboardsBulkController,
} from "./keyboard.controller";

import {
  createNewKeyboardService,
  deleteAKeyboardService,
  deleteAllKeyboardsService,
  getKeyboardByIdService,
  getQueriedKeyboardsService,
  getQueriedTotalKeyboardsService,
  returnAllKeyboardsUploadedFileIdsService,
  updateKeyboardByIdService,
} from "./keyboard.service";

import type { KeyboardDocument, KeyboardSchema } from "./keyboard.model";
import type {
  CreateNewKeyboardBulkRequest,
  CreateNewKeyboardRequest,
  DeleteAKeyboardRequest,
  DeleteAllKeyboardsRequest,
  GetKeyboardByIdRequest,
  GetQueriedKeyboardsRequest,
  UpdateKeyboardByIdRequest,
  UpdateKeyboardsBulkRequest,
} from "./keyboard.types";

/**
 * Exports
 */

export {
  KeyboardModel,
  keyboardRouter,
  createNewKeyboardBulkController,
  createNewKeyboardController,
  createNewKeyboardService,
  deleteAKeyboardController,
  deleteAKeyboardService,
  deleteAllKeyboardsController,
  deleteAllKeyboardsService,
  getKeyboardByIdController,
  getKeyboardByIdService,
  getQueriedKeyboardsController,
  getQueriedKeyboardsService,
  getQueriedTotalKeyboardsService,
  returnAllKeyboardsUploadedFileIdsService,
  updateKeyboardByIdController,
  updateKeyboardByIdService,
  updateKeyboardsBulkController,
};

export type {
  KeyboardDocument,
  KeyboardSchema,
  CreateNewKeyboardBulkRequest,
  CreateNewKeyboardRequest,
  DeleteAKeyboardRequest,
  DeleteAllKeyboardsRequest,
  GetKeyboardByIdRequest,
  GetQueriedKeyboardsRequest,
  UpdateKeyboardByIdRequest,
  UpdateKeyboardsBulkRequest,
};
