/**
 * This barrel file is used to import/export smartphone router, model, types, controllers and services
 */

/**
 * Imports
 */
import { smartphoneRouter } from "./smartphone.routes";
import { SmartphoneModel } from "./smartphone.model";

import {
  createNewSmartphoneBulkController,
  createNewSmartphoneController,
  deleteASmartphoneController,
  deleteAllSmartphonesController,
  getSmartphoneByIdController,
  getQueriedSmartphonesController,
  updateSmartphoneByIdController,
  updateSmartphonesBulkController,
} from "./smartphone.controller";

import {
  createNewSmartphoneService,
  deleteASmartphoneService,
  deleteAllSmartphonesService,
  getSmartphoneByIdService,
  getQueriedSmartphonesService,
  getQueriedTotalSmartphonesService,
  returnAllSmartphonesUploadedFileIdsService,
  updateSmartphoneByIdService,
} from "./smartphone.service";

import type { SmartphoneDocument, SmartphoneSchema } from "./smartphone.model";
import type {
  CreateNewSmartphoneBulkRequest,
  CreateNewSmartphoneRequest,
  DeleteASmartphoneRequest,
  DeleteAllSmartphonesRequest,
  GetSmartphoneByIdRequest,
  GetQueriedSmartphonesRequest,
  UpdateSmartphoneByIdRequest,
  UpdateSmartphonesBulkRequest,
} from "./smartphone.types";

/**
 * Exports
 */

export {
  SmartphoneModel,
  smartphoneRouter,
  createNewSmartphoneBulkController,
  createNewSmartphoneController,
  createNewSmartphoneService,
  deleteASmartphoneController,
  deleteASmartphoneService,
  deleteAllSmartphonesController,
  deleteAllSmartphonesService,
  getSmartphoneByIdController,
  getSmartphoneByIdService,
  getQueriedSmartphonesController,
  getQueriedSmartphonesService,
  getQueriedTotalSmartphonesService,
  returnAllSmartphonesUploadedFileIdsService,
  updateSmartphoneByIdController,
  updateSmartphoneByIdService,
  updateSmartphonesBulkController,
};

export type {
  SmartphoneDocument,
  SmartphoneSchema,
  CreateNewSmartphoneBulkRequest,
  CreateNewSmartphoneRequest,
  DeleteASmartphoneRequest,
  DeleteAllSmartphonesRequest,
  GetSmartphoneByIdRequest,
  GetQueriedSmartphonesRequest,
  UpdateSmartphoneByIdRequest,
  UpdateSmartphonesBulkRequest,
};
