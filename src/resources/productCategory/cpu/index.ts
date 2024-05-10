/**
 * This barrel file is used to import/export cpu router, model, types, controllers and services
 */

/**
 * Imports
 */
import { cpuRouter } from "./cpu.routes";
import { CpuModel } from "./cpu.model";

import {
  createNewCpuBulkController,
  createNewCpuController,
  deleteACpuController,
  deleteAllCpusController,
  getCpuByIdController,
  getQueriedCpusController,
  updateCpuByIdController,
  updateCpusBulkController,
} from "./cpu.controller";

import {
  createNewCpuService,
  deleteACpuService,
  deleteAllCpusService,
  getCpuByIdService,
  getQueriedCpusService,
  getQueriedTotalCpusService,
  returnAllCpusUploadedFileIdsService,
  updateCpuByIdService,
} from "./cpu.service";

import type { CpuDocument, CpuSchema } from "./cpu.model";
import type {
  CreateNewCpuBulkRequest,
  CreateNewCpuRequest,
  DeleteACpuRequest,
  DeleteAllCpusRequest,
  GetCpuByIdRequest,
  GetQueriedCpusRequest,
  UpdateCpuByIdRequest,
  UpdateCpusBulkRequest,
} from "./cpu.types";

/**
 * Exports
 */

export {
  CpuModel,
  cpuRouter,
  createNewCpuBulkController,
  createNewCpuController,
  createNewCpuService,
  deleteACpuController,
  deleteACpuService,
  deleteAllCpusController,
  deleteAllCpusService,
  getCpuByIdController,
  getCpuByIdService,
  getQueriedCpusController,
  getQueriedCpusService,
  getQueriedTotalCpusService,
  returnAllCpusUploadedFileIdsService,
  updateCpuByIdController,
  updateCpuByIdService,
  updateCpusBulkController,
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
  UpdateCpusBulkRequest,
};
