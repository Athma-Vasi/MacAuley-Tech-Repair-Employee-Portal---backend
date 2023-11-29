/**
 * This barrel file is used to import/export headphone router, model, types, controllers and services
 */

/**
 * Imports
 */
import { headphoneRouter } from './headphone.routes';
import { HeadphoneModel } from './headphone.model';

import {
  createNewHeadphoneBulkHandler,
  createNewHeadphoneHandler,
  deleteAHeadphoneHandler,
  deleteAllHeadphonesHandler,
  getHeadphoneByIdHandler,
  getQueriedHeadphonesHandler,
  returnAllFileUploadsForHeadphonesHandler,
  updateHeadphoneByIdHandler,
} from './headphone.controller';

import {
  createNewHeadphoneService,
  deleteAllHeadphonesService,
  deleteAHeadphoneService,
  getHeadphoneByIdService,
  getQueriedHeadphonesService,
  getQueriedTotalHeadphonesService,
  returnAllHeadphonesUploadedFileIdsService,
  updateHeadphoneByIdService,
} from './headphone.service';

import type { HeadphoneDocument, HeadphoneSchema } from './headphone.model';
import type {
  CreateNewHeadphoneBulkRequest,
  CreateNewHeadphoneRequest,
  DeleteAHeadphoneRequest,
  DeleteAllHeadphonesRequest,
  GetHeadphoneByIdRequest,
  GetQueriedHeadphonesRequest,
  UpdateHeadphoneByIdRequest,
} from './headphone.types';

/**
 * Exports
 */

export {
  HeadphoneModel,
  headphoneRouter,
  createNewHeadphoneBulkHandler,
  createNewHeadphoneHandler,
  createNewHeadphoneService,
  deleteAHeadphoneHandler,
  deleteAllHeadphonesHandler,
  deleteAllHeadphonesService,
  deleteAHeadphoneService,
  getHeadphoneByIdHandler,
  getHeadphoneByIdService,
  getQueriedHeadphonesHandler,
  getQueriedHeadphonesService,
  getQueriedTotalHeadphonesService,
  returnAllHeadphonesUploadedFileIdsService,
  returnAllFileUploadsForHeadphonesHandler,
  updateHeadphoneByIdHandler,
  updateHeadphoneByIdService,
};

export type {
  CreateNewHeadphoneBulkRequest,
  CreateNewHeadphoneRequest,
  DeleteAHeadphoneRequest,
  DeleteAllHeadphonesRequest,
  GetHeadphoneByIdRequest,
  GetQueriedHeadphonesRequest,
  HeadphoneDocument,
  HeadphoneSchema,
  UpdateHeadphoneByIdRequest,
};
