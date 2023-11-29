/**
 * This barrel file is used to import/export motherboard router, model, types, controllers and services
 */

/**
 * Imports
 */
import { motherboardRouter } from './motherboard.routes';
import { MotherboardModel } from './motherboard.model';

import {
  createNewMotherboardBulkHandler,
  createNewMotherboardHandler,
  deleteAMotherboardHandler,
  deleteAllMotherboardsHandler,
  getMotherboardByIdHandler,
  getQueriedMotherboardsHandler,
  returnAllFileUploadsForMotherboardsHandler,
  updateMotherboardByIdHandler,
} from './motherboard.controller';

import {
  createNewMotherboardService,
  deleteAllMotherboardsService,
  deleteAMotherboardService,
  getMotherboardByIdService,
  getQueriedMotherboardsService,
  getQueriedTotalMotherboardsService,
  returnAllMotherboardsUploadedFileIdsService,
  updateMotherboardByIdService,
} from './motherboard.service';

import type { MotherboardDocument, MotherboardSchema } from './motherboard.model';
import type {
  CreateNewMotherboardBulkRequest,
  CreateNewMotherboardRequest,
  DeleteAMotherboardRequest,
  DeleteAllMotherboardsRequest,
  GetMotherboardByIdRequest,
  GetQueriedMotherboardsRequest,
  UpdateMotherboardByIdRequest,
} from './motherboard.types';

/**
 * Exports
 */

export {
  MotherboardModel,
  motherboardRouter,
  createNewMotherboardBulkHandler,
  createNewMotherboardHandler,
  createNewMotherboardService,
  deleteAMotherboardHandler,
  deleteAllMotherboardsHandler,
  deleteAllMotherboardsService,
  deleteAMotherboardService,
  getMotherboardByIdHandler,
  getMotherboardByIdService,
  getQueriedMotherboardsHandler,
  getQueriedMotherboardsService,
  getQueriedTotalMotherboardsService,
  returnAllMotherboardsUploadedFileIdsService,
  returnAllFileUploadsForMotherboardsHandler,
  updateMotherboardByIdHandler,
  updateMotherboardByIdService,
};

export type {
  CreateNewMotherboardBulkRequest,
  CreateNewMotherboardRequest,
  DeleteAMotherboardRequest,
  DeleteAllMotherboardsRequest,
  GetMotherboardByIdRequest,
  GetQueriedMotherboardsRequest,
  MotherboardDocument,
  MotherboardSchema,
  UpdateMotherboardByIdRequest,
};
