/**
 * This barrel file is used to import/export psu router, model, types, controllers and services
 */

/**
 * Imports
 */
import { psuRouter } from './psu.routes';
import { PsuModel } from './psu.model';

import {
  createNewPsuBulkHandler,
  createNewPsuHandler,
  deleteAPsuHandler,
  deleteAllPsusHandler,
  getPsuByIdHandler,
  getQueriedPsusHandler,
  returnAllFileUploadsForPsusHandler,
  updatePsuByIdHandler,
} from './psu.controller';

import {
  createNewPsuService,
  deleteAllPsusService,
  deleteAPsuService,
  getPsuByIdService,
  getQueriedPsusService,
  getQueriedTotalPsusService,
  returnAllPsusUploadedFileIdsService,
  updatePsuByIdService,
} from './psu.service';

import type { PsuDocument, PsuSchema } from './psu.model';
import type {
  CreateNewPsuBulkRequest,
  CreateNewPsuRequest,
  DeleteAPsuRequest,
  DeleteAllPsusRequest,
  GetPsuByIdRequest,
  GetQueriedPsusRequest,
  UpdatePsuByIdRequest,
} from './psu.types';

/**
 * Exports
 */

export {
  PsuModel,
  psuRouter,
  createNewPsuBulkHandler,
  createNewPsuHandler,
  createNewPsuService,
  deleteAPsuHandler,
  deleteAllPsusHandler,
  deleteAllPsusService,
  deleteAPsuService,
  getPsuByIdHandler,
  getPsuByIdService,
  getQueriedPsusHandler,
  getQueriedPsusService,
  getQueriedTotalPsusService,
  returnAllPsusUploadedFileIdsService,
  returnAllFileUploadsForPsusHandler,
  updatePsuByIdHandler,
  updatePsuByIdService,
};

export type {
  CreateNewPsuBulkRequest,
  CreateNewPsuRequest,
  DeleteAPsuRequest,
  DeleteAllPsusRequest,
  GetPsuByIdRequest,
  GetQueriedPsusRequest,
  PsuDocument,
  PsuSchema,
  UpdatePsuByIdRequest,
};
