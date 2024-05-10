/**
 * This barrel file is used to import/export mouse router, model, types, controllers and services
 */

/**
 * Imports
 */
import { mouseRouter } from "./mouse.routes";
import { MouseModel } from "./mouse.model";

import {
  createNewMouseBulkController,
  createNewMouseController,
  deleteAMouseController,
  deleteAllMiceController,
  getMouseByIdController,
  getQueriedMiceController,
  updateMouseByIdController,
  updateMiceBulkController,
} from "./mouse.controller";

import {
  createNewMouseService,
  deleteAMouseService,
  deleteAllMiceService,
  getMouseByIdService,
  getQueriedMiceService,
  getQueriedTotalMiceService,
  returnAllMiceUploadedFileIdsService,
  updateMouseByIdService,
} from "./mouse.service";

import type { MouseDocument, MouseSchema } from "./mouse.model";
import type {
  CreateNewMouseBulkRequest,
  CreateNewMouseRequest,
  DeleteAMouseRequest,
  DeleteAllMiceRequest,
  GetMouseByIdRequest,
  GetQueriedMiceRequest,
  UpdateMouseByIdRequest,
  UpdateMiceBulkRequest,
} from "./mouse.types";

/**
 * Exports
 */

export {
  MouseModel,
  mouseRouter,
  createNewMouseBulkController,
  createNewMouseController,
  createNewMouseService,
  deleteAMouseController,
  deleteAMouseService,
  deleteAllMiceController,
  deleteAllMiceService,
  getMouseByIdController,
  getMouseByIdService,
  getQueriedMiceController,
  getQueriedMiceService,
  getQueriedTotalMiceService,
  returnAllMiceUploadedFileIdsService,
  updateMouseByIdController,
  updateMouseByIdService,
  updateMiceBulkController,
};

export type {
  MouseDocument,
  MouseSchema,
  CreateNewMouseBulkRequest,
  CreateNewMouseRequest,
  DeleteAMouseRequest,
  DeleteAllMiceRequest,
  GetMouseByIdRequest,
  GetQueriedMiceRequest,
  UpdateMouseByIdRequest,
  UpdateMiceBulkRequest,
};
