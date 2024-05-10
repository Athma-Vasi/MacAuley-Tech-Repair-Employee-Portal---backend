/**
 * This barrel file is used to import/export psu router, model, types, controllers and services
 */

/**
 * Imports
 */
import { psuRouter } from "./psu.routes";
import { PsuModel } from "./psu.model";

import {
  createNewPsuBulkController,
  createNewPsuController,
  deleteAPsuController,
  deleteAllPsusController,
  getPsuByIdController,
  getQueriedPsusController,
  updatePsuByIdController,
  updatePsusBulkController,
} from "./psu.controller";

import {
  createNewPsuService,
  deleteAPsuService,
  deleteAllPsusService,
  getPsuByIdService,
  getQueriedPsusService,
  getQueriedTotalPsusService,
  returnAllPsusUploadedFileIdsService,
  updatePsuByIdService,
} from "./psu.service";

import type { PsuDocument, PsuSchema } from "./psu.model";
import type {
  CreateNewPsuBulkRequest,
  CreateNewPsuRequest,
  DeleteAPsuRequest,
  DeleteAllPsusRequest,
  GetPsuByIdRequest,
  GetQueriedPsusRequest,
  UpdatePsuByIdRequest,
  UpdatePsusBulkRequest,
} from "./psu.types";

/**
 * Exports
 */

export {
  PsuModel,
  psuRouter,
  createNewPsuBulkController,
  createNewPsuController,
  createNewPsuService,
  deleteAPsuController,
  deleteAPsuService,
  deleteAllPsusController,
  deleteAllPsusService,
  getPsuByIdController,
  getPsuByIdService,
  getQueriedPsusController,
  getQueriedPsusService,
  getQueriedTotalPsusService,
  returnAllPsusUploadedFileIdsService,
  updatePsuByIdController,
  updatePsuByIdService,
  updatePsusBulkController,
};

export type {
  PsuDocument,
  PsuSchema,
  CreateNewPsuBulkRequest,
  CreateNewPsuRequest,
  DeleteAPsuRequest,
  DeleteAllPsusRequest,
  GetPsuByIdRequest,
  GetQueriedPsusRequest,
  UpdatePsuByIdRequest,
  UpdatePsusBulkRequest,
};
