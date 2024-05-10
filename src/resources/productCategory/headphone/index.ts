/**
 * This barrel file is used to import/export headphone router, model, types, controllers and services
 */

/**
 * Imports
 */
import { headphoneRouter } from "./headphone.routes";
import { HeadphoneModel } from "./headphone.model";

import {
  createNewHeadphoneBulkController,
  createNewHeadphoneController,
  deleteAHeadphoneController,
  deleteAllHeadphonesController,
  getHeadphoneByIdController,
  getQueriedHeadphonesController,
  updateHeadphoneByIdController,
  updateHeadphonesBulkController,
} from "./headphone.controller";

import {
  createNewHeadphoneService,
  deleteAHeadphoneService,
  deleteAllHeadphonesService,
  getHeadphoneByIdService,
  getQueriedHeadphonesService,
  getQueriedTotalHeadphonesService,
  returnAllHeadphonesUploadedFileIdsService,
  updateHeadphoneByIdService,
} from "./headphone.service";

import type { HeadphoneDocument, HeadphoneSchema } from "./headphone.model";
import type {
  CreateNewHeadphoneBulkRequest,
  CreateNewHeadphoneRequest,
  DeleteAHeadphoneRequest,
  DeleteAllHeadphonesRequest,
  GetHeadphoneByIdRequest,
  GetQueriedHeadphonesRequest,
  UpdateHeadphoneByIdRequest,
  UpdateHeadphonesBulkRequest,
} from "./headphone.types";

/**
 * Exports
 */

export {
  HeadphoneModel,
  headphoneRouter,
  createNewHeadphoneBulkController,
  createNewHeadphoneController,
  createNewHeadphoneService,
  deleteAHeadphoneController,
  deleteAHeadphoneService,
  deleteAllHeadphonesController,
  deleteAllHeadphonesService,
  getHeadphoneByIdController,
  getHeadphoneByIdService,
  getQueriedHeadphonesController,
  getQueriedHeadphonesService,
  getQueriedTotalHeadphonesService,
  returnAllHeadphonesUploadedFileIdsService,
  updateHeadphoneByIdController,
  updateHeadphoneByIdService,
  updateHeadphonesBulkController,
};

export type {
  HeadphoneDocument,
  HeadphoneSchema,
  CreateNewHeadphoneBulkRequest,
  CreateNewHeadphoneRequest,
  DeleteAHeadphoneRequest,
  DeleteAllHeadphonesRequest,
  GetHeadphoneByIdRequest,
  GetQueriedHeadphonesRequest,
  UpdateHeadphoneByIdRequest,
  UpdateHeadphonesBulkRequest,
};
