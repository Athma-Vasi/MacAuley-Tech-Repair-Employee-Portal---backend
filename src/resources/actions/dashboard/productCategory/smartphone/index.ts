/**
 * This barrel file is used to import/export smartphone router, model, types, controllers and services
 */

/**
 * Imports
 */
import { smartphoneRouter } from './smartphone.routes';
import { SmartphoneModel } from './smartphone.model';

import {
  createNewSmartphoneBulkHandler,
  createNewSmartphoneHandler,
  deleteASmartphoneHandler,
  deleteAllSmartphonesHandler,
  getSmartphoneByIdHandler,
  getQueriedSmartphonesHandler,
  returnAllFileUploadsForSmartphonesHandler,
  updateSmartphoneByIdHandler,
} from './smartphone.controller';

import {
  createNewSmartphoneService,
  deleteAllSmartphonesService,
  deleteASmartphoneService,
  getSmartphoneByIdService,
  getQueriedSmartphonesService,
  getQueriedTotalSmartphonesService,
  returnAllSmartphonesUploadedFileIdsService,
  updateSmartphoneByIdService,
} from './smartphone.service';

import type { SmartphoneDocument, SmartphoneSchema } from './smartphone.model';
import type {
  CreateNewSmartphoneBulkRequest,
  CreateNewSmartphoneRequest,
  DeleteASmartphoneRequest,
  DeleteAllSmartphonesRequest,
  GetSmartphoneByIdRequest,
  GetQueriedSmartphonesRequest,
  UpdateSmartphoneByIdRequest,
} from './smartphone.types';

/**
 * Exports
 */

export {
  SmartphoneModel,
  smartphoneRouter,
  createNewSmartphoneBulkHandler,
  createNewSmartphoneHandler,
  createNewSmartphoneService,
  deleteASmartphoneHandler,
  deleteAllSmartphonesHandler,
  deleteAllSmartphonesService,
  deleteASmartphoneService,
  getSmartphoneByIdHandler,
  getSmartphoneByIdService,
  getQueriedSmartphonesHandler,
  getQueriedSmartphonesService,
  getQueriedTotalSmartphonesService,
  returnAllSmartphonesUploadedFileIdsService,
  returnAllFileUploadsForSmartphonesHandler,
  updateSmartphoneByIdHandler,
  updateSmartphoneByIdService,
};

export type {
  CreateNewSmartphoneBulkRequest,
  CreateNewSmartphoneRequest,
  DeleteASmartphoneRequest,
  DeleteAllSmartphonesRequest,
  GetSmartphoneByIdRequest,
  GetQueriedSmartphonesRequest,
  SmartphoneDocument,
  SmartphoneSchema,
  UpdateSmartphoneByIdRequest,
};
