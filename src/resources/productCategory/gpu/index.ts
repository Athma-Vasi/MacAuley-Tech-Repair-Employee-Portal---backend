/**
 * This barrel file is used to import/export gpu router, model, types, controllers and services
 */

/**
 * Imports
 */
import { gpuRouter } from "./gpu.routes";
import { GpuModel } from "./gpu.model";

import {
  createNewGpuBulkController,
  createNewGpuController,
  deleteAGpuController,
  deleteAllGpusController,
  getGpuByIdController,
  getQueriedGpusController,
  updateGpuByIdController,
  updateGpusBulkController,
} from "./gpu.controller";

import {
  createNewGpuService,
  deleteAGpuService,
  deleteAllGpusService,
  getGpuByIdService,
  getQueriedGpusService,
  getQueriedTotalGpusService,
  returnAllGpusUploadedFileIdsService,
  updateGpuByIdService,
} from "./gpu.service";

import type { GpuDocument, GpuSchema } from "./gpu.model";
import type {
  CreateNewGpuBulkRequest,
  CreateNewGpuRequest,
  DeleteAGpuRequest,
  DeleteAllGpusRequest,
  GetGpuByIdRequest,
  GetQueriedGpusRequest,
  UpdateGpuByIdRequest,
  UpdateGpusBulkRequest,
} from "./gpu.types";

/**
 * Exports
 */

export {
  GpuModel,
  gpuRouter,
  createNewGpuBulkController,
  createNewGpuController,
  createNewGpuService,
  deleteAGpuController,
  deleteAGpuService,
  deleteAllGpusController,
  deleteAllGpusService,
  getGpuByIdController,
  getGpuByIdService,
  getQueriedGpusController,
  getQueriedGpusService,
  getQueriedTotalGpusService,
  returnAllGpusUploadedFileIdsService,
  updateGpuByIdController,
  updateGpuByIdService,
  updateGpusBulkController,
};

export type {
  GpuDocument,
  GpuSchema,
  CreateNewGpuBulkRequest,
  CreateNewGpuRequest,
  DeleteAGpuRequest,
  DeleteAllGpusRequest,
  GetGpuByIdRequest,
  GetQueriedGpusRequest,
  UpdateGpuByIdRequest,
  UpdateGpusBulkRequest,
};
