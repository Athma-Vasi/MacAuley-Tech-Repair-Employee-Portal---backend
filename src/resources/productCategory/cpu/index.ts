/**
 * This barrel file is used to import/export cpu router, model, types, controllers and services
 */

/**
 * Imports
 */
import { cpuRouter } from './cpu.routes';
import { CpuModel } from './cpu.model';

import {
  createNewCpuBulkHandler,
  createNewCpuHandler,
  deleteACpuHandler,
  deleteAllCpusHandler,
  getCpuByIdHandler,
  getQueriedCpusHandler,
  returnAllFileUploadsForCpusHandler,
  updateCpuByIdHandler,
} from './cpu.controller';

import {
  createNewCpuService,
  deleteAllCpusService,
  deleteACpuService,
  getCpuByIdService,
  getQueriedCpusService,
  getQueriedTotalCpusService,
  returnAllCpusUploadedFileIdsService,
  updateCpuByIdService,
} from './cpu.service';

import type { CpuDocument, CpuSchema } from './cpu.model';
import type {
  CreateNewCpuBulkRequest,
  CreateNewCpuRequest,
  DeleteACpuRequest,
  DeleteAllCpusRequest,
  GetCpuByIdRequest,
  GetQueriedCpusRequest,
  UpdateCpuByIdRequest,
} from './cpu.types';

/**
 * Exports
 */

export {
  CpuModel,
  cpuRouter,
  createNewCpuBulkHandler,
  createNewCpuHandler,
  createNewCpuService,
  deleteACpuHandler,
  deleteAllCpusHandler,
  deleteAllCpusService,
  deleteACpuService,
  getCpuByIdHandler,
  getCpuByIdService,
  getQueriedCpusHandler,
  getQueriedCpusService,
  getQueriedTotalCpusService,
  returnAllCpusUploadedFileIdsService,
  returnAllFileUploadsForCpusHandler,
  updateCpuByIdHandler,
  updateCpuByIdService,
};

export type {
  CpuDocument,
  CpuSchema,
  CreateNewCpuBulkRequest,
  CreateNewCpuRequest,
  DeleteACpuRequest,
  DeleteAllCpusRequest,
  GetCpuByIdRequest,
  GetQueriedCpusRequest,
  UpdateCpuByIdRequest,
};
