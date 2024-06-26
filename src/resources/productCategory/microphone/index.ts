/**
 * This barrel file is used to import/export microphone router, model, types, controllers and services
 */

/**
 * Imports
 */
import { microphoneRouter } from "./microphone.routes";
import { MicrophoneModel } from "./microphone.model";

import {
  createNewMicrophoneBulkController,
  createNewMicrophoneController,
  deleteAMicrophoneController,
  deleteAllMicrophonesController,
  getMicrophoneByIdController,
  getQueriedMicrophonesController,
  updateMicrophoneByIdController,
  updateMicrophonesBulkController,
} from "./microphone.controller";

import {
  createNewMicrophoneService,
  deleteAMicrophoneService,
  deleteAllMicrophonesService,
  getMicrophoneByIdService,
  getQueriedMicrophonesService,
  getQueriedTotalMicrophonesService,
  returnAllMicrophonesUploadedFileIdsService,
  updateMicrophoneByIdService,
} from "./microphone.service";

import type { MicrophoneDocument, MicrophoneSchema } from "./microphone.model";
import type {
  CreateNewMicrophoneBulkRequest,
  CreateNewMicrophoneRequest,
  DeleteAMicrophoneRequest,
  DeleteAllMicrophonesRequest,
  GetMicrophoneByIdRequest,
  GetQueriedMicrophonesRequest,
  UpdateMicrophoneByIdRequest,
  UpdateMicrophonesBulkRequest,
} from "./microphone.types";

/**
 * Exports
 */

export {
  MicrophoneModel,
  microphoneRouter,
  createNewMicrophoneBulkController,
  createNewMicrophoneController,
  createNewMicrophoneService,
  deleteAMicrophoneController,
  deleteAMicrophoneService,
  deleteAllMicrophonesController,
  deleteAllMicrophonesService,
  getMicrophoneByIdController,
  getMicrophoneByIdService,
  getQueriedMicrophonesController,
  getQueriedMicrophonesService,
  getQueriedTotalMicrophonesService,
  returnAllMicrophonesUploadedFileIdsService,
  updateMicrophoneByIdController,
  updateMicrophoneByIdService,
  updateMicrophonesBulkController,
};

export type {
  MicrophoneDocument,
  MicrophoneSchema,
  CreateNewMicrophoneBulkRequest,
  CreateNewMicrophoneRequest,
  DeleteAMicrophoneRequest,
  DeleteAllMicrophonesRequest,
  GetMicrophoneByIdRequest,
  GetQueriedMicrophonesRequest,
  UpdateMicrophoneByIdRequest,
  UpdateMicrophonesBulkRequest,
};
