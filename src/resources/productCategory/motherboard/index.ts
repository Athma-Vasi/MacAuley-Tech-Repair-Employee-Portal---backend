/**
 * This barrel file is used to import/export motherboard router, model, types, controllers and services
 */

/**
 * Imports
 */
import { motherboardRouter } from "./motherboard.routes";
import { MotherboardModel } from "./motherboard.model";

import {
  createNewMotherboardBulkController,
  createNewMotherboardController,
  deleteAMotherboardController,
  deleteAllMotherboardsController,
  getMotherboardByIdController,
  getQueriedMotherboardsController,
  updateMotherboardByIdController,
  updateMotherboardsBulkController,
} from "./motherboard.controller";

import {
  createNewMotherboardService,
  deleteAMotherboardService,
  deleteAllMotherboardsService,
  getMotherboardByIdService,
  getQueriedMotherboardsService,
  getQueriedTotalMotherboardsService,
  returnAllMotherboardsUploadedFileIdsService,
  updateMotherboardByIdService,
} from "./motherboard.service";

import type { MotherboardDocument, MotherboardSchema } from "./motherboard.model";
import type {
  CreateNewMotherboardBulkRequest,
  CreateNewMotherboardRequest,
  DeleteAMotherboardRequest,
  DeleteAllMotherboardsRequest,
  GetMotherboardByIdRequest,
  GetQueriedMotherboardsRequest,
  UpdateMotherboardByIdRequest,
  UpdateMotherboardsBulkRequest,
} from "./motherboard.types";

/**
 * Exports
 */

export {
  MotherboardModel,
  motherboardRouter,
  createNewMotherboardBulkController,
  createNewMotherboardController,
  createNewMotherboardService,
  deleteAMotherboardController,
  deleteAMotherboardService,
  deleteAllMotherboardsController,
  deleteAllMotherboardsService,
  getMotherboardByIdController,
  getMotherboardByIdService,
  getQueriedMotherboardsController,
  getQueriedMotherboardsService,
  getQueriedTotalMotherboardsService,
  returnAllMotherboardsUploadedFileIdsService,
  updateMotherboardByIdController,
  updateMotherboardByIdService,
  updateMotherboardsBulkController,
};

export type {
  MotherboardDocument,
  MotherboardSchema,
  CreateNewMotherboardBulkRequest,
  CreateNewMotherboardRequest,
  DeleteAMotherboardRequest,
  DeleteAllMotherboardsRequest,
  GetMotherboardByIdRequest,
  GetQueriedMotherboardsRequest,
  UpdateMotherboardByIdRequest,
  UpdateMotherboardsBulkRequest,
};
