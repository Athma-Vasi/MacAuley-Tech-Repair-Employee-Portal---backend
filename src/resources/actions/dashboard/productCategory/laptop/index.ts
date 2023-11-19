/**
 * This barrel file is used to import/export laptop router, model, types, controllers and services
 */

/**
 * Imports
 */
import { laptopRouter } from './laptop.routes';
import { LaptopModel } from './laptop.model';

import {
  createNewLaptopBulkHandler,
  createNewLaptopHandler,
  deleteALaptopHandler,
  deleteAllLaptopsHandler,
  getLaptopByIdHandler,
  getQueriedLaptopsHandler,
  returnAllFileUploadsForLaptopsHandler,
  updateLaptopByIdHandler,
} from './laptop.controller';

import {
  createNewLaptopService,
  deleteAllLaptopsService,
  deleteALaptopService,
  getLaptopByIdService,
  getQueriedLaptopsService,
  getQueriedTotalLaptopsService,
  returnAllLaptopsUploadedFileIdsService,
  updateLaptopByIdService,
} from './laptop.service';

import type { LaptopDocument, LaptopSchema } from './laptop.model';
import type {
  CreateNewLaptopBulkRequest,
  CreateNewLaptopRequest,
  DeleteALaptopRequest,
  DeleteAllLaptopsRequest,
  GetLaptopByIdRequest,
  GetQueriedLaptopsRequest,
  UpdateLaptopByIdRequest,
} from './laptop.types';

/**
 * Exports
 */

export {
  LaptopModel,
  laptopRouter,
  createNewLaptopBulkHandler,
  createNewLaptopHandler,
  createNewLaptopService,
  deleteALaptopHandler,
  deleteAllLaptopsHandler,
  deleteAllLaptopsService,
  deleteALaptopService,
  getLaptopByIdHandler,
  getLaptopByIdService,
  getQueriedLaptopsHandler,
  getQueriedLaptopsService,
  getQueriedTotalLaptopsService,
  returnAllLaptopsUploadedFileIdsService,
  returnAllFileUploadsForLaptopsHandler,
  updateLaptopByIdHandler,
  updateLaptopByIdService,
};

export type {
  CreateNewLaptopBulkRequest,
  CreateNewLaptopRequest,
  DeleteALaptopRequest,
  DeleteAllLaptopsRequest,
  GetLaptopByIdRequest,
  GetQueriedLaptopsRequest,
  LaptopDocument,
  LaptopSchema,
  UpdateLaptopByIdRequest,
};
