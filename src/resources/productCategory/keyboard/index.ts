/**
 * This barrel file is used to import/export keyboard router, model, types, controllers and services
 */

/**
 * Imports
 */
import { keyboardRouter } from './keyboard.routes';
import { KeyboardModel } from './keyboard.model';

import {
  createNewKeyboardBulkHandler,
  createNewKeyboardHandler,
  deleteAKeyboardHandler,
  deleteAllKeyboardsHandler,
  getKeyboardByIdHandler,
  getQueriedKeyboardsHandler,
  returnAllFileUploadsForKeyboardsHandler,
  updateKeyboardByIdHandler,
} from './keyboard.controller';

import {
  createNewKeyboardService,
  deleteAllKeyboardsService,
  deleteAKeyboardService,
  getKeyboardByIdService,
  getQueriedKeyboardsService,
  getQueriedTotalKeyboardsService,
  returnAllKeyboardsUploadedFileIdsService,
  updateKeyboardByIdService,
} from './keyboard.service';

import type { KeyboardDocument, KeyboardSchema } from './keyboard.model';
import type {
  CreateNewKeyboardBulkRequest,
  CreateNewKeyboardRequest,
  DeleteAKeyboardRequest,
  DeleteAllKeyboardsRequest,
  GetKeyboardByIdRequest,
  GetQueriedKeyboardsRequest,
  UpdateKeyboardByIdRequest,
} from './keyboard.types';

/**
 * Exports
 */

export {
  KeyboardModel,
  keyboardRouter,
  createNewKeyboardBulkHandler,
  createNewKeyboardHandler,
  createNewKeyboardService,
  deleteAKeyboardHandler,
  deleteAllKeyboardsHandler,
  deleteAllKeyboardsService,
  deleteAKeyboardService,
  getKeyboardByIdHandler,
  getKeyboardByIdService,
  getQueriedKeyboardsHandler,
  getQueriedKeyboardsService,
  getQueriedTotalKeyboardsService,
  returnAllKeyboardsUploadedFileIdsService,
  returnAllFileUploadsForKeyboardsHandler,
  updateKeyboardByIdHandler,
  updateKeyboardByIdService,
};

export type {
  CreateNewKeyboardBulkRequest,
  CreateNewKeyboardRequest,
  DeleteAKeyboardRequest,
  DeleteAllKeyboardsRequest,
  GetKeyboardByIdRequest,
  GetQueriedKeyboardsRequest,
  KeyboardDocument,
  KeyboardSchema,
  UpdateKeyboardByIdRequest,
};
