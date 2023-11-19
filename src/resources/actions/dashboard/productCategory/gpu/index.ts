/**
 * This barrel file is used to import/export gpu router, model, types, controllers and services
 */

/**
 * Imports
 */
import { gpuRouter } from './gpu.routes';
import { GpuModel } from './gpu.model';

import {
  createNewGpuBulkHandler,
  createNewGpuHandler,
  deleteAGpuHandler,
  deleteAllGpusHandler,
  getGpuByIdHandler,
  getQueriedGpusHandler,
  returnAllFileUploadsForGpusHandler,
  updateGpuByIdHandler,
} from './gpu.controller';

import {
  createNewGpuService,
  deleteAllGpusService,
  deleteAGpuService,
  getGpuByIdService,
  getQueriedGpusService,
  getQueriedTotalGpusService,
  returnAllGpusUploadedFileIdsService,
  updateGpuByIdService,
} from './gpu.service';

import type { GpuDocument, GpuSchema } from './gpu.model';
import type {
  CreateNewGpuBulkRequest,
  CreateNewGpuRequest,
  DeleteAGpuRequest,
  DeleteAllGpusRequest,
  GetGpuByIdRequest,
  GetQueriedGpusRequest,
  UpdateGpuByIdRequest,
} from './gpu.types';

/**
 * Exports
 */

export {
  GpuModel,
  gpuRouter,
  createNewGpuBulkHandler,
  createNewGpuHandler,
  createNewGpuService,
  deleteAGpuHandler,
  deleteAllGpusHandler,
  deleteAllGpusService,
  deleteAGpuService,
  getGpuByIdHandler,
  getGpuByIdService,
  getQueriedGpusHandler,
  getQueriedGpusService,
  getQueriedTotalGpusService,
  returnAllGpusUploadedFileIdsService,
  returnAllFileUploadsForGpusHandler,
  updateGpuByIdHandler,
  updateGpuByIdService,
};

export type {
  CreateNewGpuBulkRequest,
  CreateNewGpuRequest,
  DeleteAGpuRequest,
  DeleteAllGpusRequest,
  GetGpuByIdRequest,
  GetQueriedGpusRequest,
  GpuDocument,
  GpuSchema,
  UpdateGpuByIdRequest,
};
