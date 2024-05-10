/**
 * This barrel file is used to import/export laptop router, model, types, controllers and services
 */

/**
 * Imports
 */
import { laptopRouter } from "./laptop.routes";
import { LaptopModel } from "./laptop.model";

import {
  createNewLaptopBulkController,
  createNewLaptopController,
  deleteALaptopController,
  deleteAllLaptopsController,
  getLaptopByIdController,
  getQueriedLaptopsController,
  updateLaptopByIdController,
  updateLaptopsBulkController,
} from "./laptop.controller";

import {
  createNewLaptopService,
  deleteALaptopService,
  deleteAllLaptopsService,
  getLaptopByIdService,
  getQueriedLaptopsService,
  getQueriedTotalLaptopsService,
  returnAllLaptopsUploadedFileIdsService,
  updateLaptopByIdService,
} from "./laptop.service";

import type { LaptopDocument, LaptopSchema } from "./laptop.model";
import type {
  CreateNewLaptopBulkRequest,
  CreateNewLaptopRequest,
  DeleteALaptopRequest,
  DeleteAllLaptopsRequest,
  GetLaptopByIdRequest,
  GetQueriedLaptopsRequest,
  UpdateLaptopByIdRequest,
  UpdateLaptopsBulkRequest,
} from "./laptop.types";

/**
 * Exports
 */

export {
  LaptopModel,
  laptopRouter,
  createNewLaptopBulkController,
  createNewLaptopController,
  createNewLaptopService,
  deleteALaptopController,
  deleteALaptopService,
  deleteAllLaptopsController,
  deleteAllLaptopsService,
  getLaptopByIdController,
  getLaptopByIdService,
  getQueriedLaptopsController,
  getQueriedLaptopsService,
  getQueriedTotalLaptopsService,
  returnAllLaptopsUploadedFileIdsService,
  updateLaptopByIdController,
  updateLaptopByIdService,
  updateLaptopsBulkController,
};

export type {
  LaptopDocument,
  LaptopSchema,
  CreateNewLaptopBulkRequest,
  CreateNewLaptopRequest,
  DeleteALaptopRequest,
  DeleteAllLaptopsRequest,
  GetLaptopByIdRequest,
  GetQueriedLaptopsRequest,
  UpdateLaptopByIdRequest,
  UpdateLaptopsBulkRequest,
};
