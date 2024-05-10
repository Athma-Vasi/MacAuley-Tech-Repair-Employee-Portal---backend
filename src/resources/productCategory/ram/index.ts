/**
 * This barrel file is used to import/export ram router, model, types, controllers and services
 */

/**
 * Imports
 */
import { ramRouter } from "./ram.routes";
import { RamModel } from "./ram.model";

import {
  createNewRamBulkController,
  createNewRamController,
  deleteARamController,
  deleteAllRamsController,
  getRamByIdController,
  getQueriedRamsController,
  updateRamByIdController,
  updateRamsBulkController,
} from "./ram.controller";

import {
  createNewRamService,
  deleteARamService,
  deleteAllRamsService,
  getRamByIdService,
  getQueriedRamsService,
  getQueriedTotalRamsService,
  returnAllRamsUploadedFileIdsService,
  updateRamByIdService,
} from "./ram.service";

import type { RamDocument, RamSchema } from "./ram.model";
import type {
  CreateNewRamBulkRequest,
  CreateNewRamRequest,
  DeleteARamRequest,
  DeleteAllRamsRequest,
  GetRamByIdRequest,
  GetQueriedRamsRequest,
  UpdateRamByIdRequest,
  UpdateRamsBulkRequest,
} from "./ram.types";

/**
 * Exports
 */

export {
  RamModel,
  ramRouter,
  createNewRamBulkController,
  createNewRamController,
  createNewRamService,
  deleteARamController,
  deleteARamService,
  deleteAllRamsController,
  deleteAllRamsService,
  getRamByIdController,
  getRamByIdService,
  getQueriedRamsController,
  getQueriedRamsService,
  getQueriedTotalRamsService,
  returnAllRamsUploadedFileIdsService,
  updateRamByIdController,
  updateRamByIdService,
  updateRamsBulkController,
};

export type {
  RamDocument,
  RamSchema,
  CreateNewRamBulkRequest,
  CreateNewRamRequest,
  DeleteARamRequest,
  DeleteAllRamsRequest,
  GetRamByIdRequest,
  GetQueriedRamsRequest,
  UpdateRamByIdRequest,
  UpdateRamsBulkRequest,
};
