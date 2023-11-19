/**
 * This barrel file is used to import/export ram router, model, types, controllers and services
 */

/**
 * Imports
 */
import { ramRouter } from './ram.routes';
import { RamModel } from './ram.model';

import {
  createNewRamBulkHandler,
  createNewRamHandler,
  deleteARamHandler,
  deleteAllRamsHandler,
  getRamByIdHandler,
  getQueriedRamsHandler,
  returnAllFileUploadsForRamsHandler,
  updateRamByIdHandler,
} from './ram.controller';

import {
  createNewRamService,
  deleteAllRamsService,
  deleteARamService,
  getRamByIdService,
  getQueriedRamsService,
  getQueriedTotalRamsService,
  returnAllRamsUploadedFileIdsService,
  updateRamByIdService,
} from './ram.service';

import type { RamDocument, RamSchema } from './ram.model';
import type {
  CreateNewRamBulkRequest,
  CreateNewRamRequest,
  DeleteARamRequest,
  DeleteAllRamsRequest,
  GetRamByIdRequest,
  GetQueriedRamsRequest,
  UpdateRamByIdRequest,
} from './ram.types';

/**
 * Exports
 */

export {
  RamModel,
  ramRouter,
  createNewRamBulkHandler,
  createNewRamHandler,
  createNewRamService,
  deleteARamHandler,
  deleteAllRamsHandler,
  deleteAllRamsService,
  deleteARamService,
  getRamByIdHandler,
  getRamByIdService,
  getQueriedRamsHandler,
  getQueriedRamsService,
  getQueriedTotalRamsService,
  returnAllRamsUploadedFileIdsService,
  returnAllFileUploadsForRamsHandler,
  updateRamByIdHandler,
  updateRamByIdService,
};

export type {
  CreateNewRamBulkRequest,
  CreateNewRamRequest,
  DeleteARamRequest,
  DeleteAllRamsRequest,
  GetRamByIdRequest,
  GetQueriedRamsRequest,
  RamDocument,
  RamSchema,
  UpdateRamByIdRequest,
};
