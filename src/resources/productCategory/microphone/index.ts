/**
 * This barrel file is used to import/export microphone router, model, types, controllers and services
 */

/**
 * Imports
 */
import { microphoneRouter } from './microphone.routes';
import { MicrophoneModel } from './microphone.model';

import {
  createNewMicrophoneBulkHandler,
  createNewMicrophoneHandler,
  deleteAMicrophoneHandler,
  deleteAllMicrophonesHandler,
  getMicrophoneByIdHandler,
  getQueriedMicrophonesHandler,
  returnAllFileUploadsForMicrophonesHandler,
  updateMicrophoneByIdHandler,
} from './microphone.controller';

import {
  createNewMicrophoneService,
  deleteAllMicrophonesService,
  deleteAMicrophoneService,
  getMicrophoneByIdService,
  getQueriedMicrophonesService,
  getQueriedTotalMicrophonesService,
  returnAllMicrophonesUploadedFileIdsService,
  updateMicrophoneByIdService,
} from './microphone.service';

import type { MicrophoneDocument, MicrophoneSchema } from './microphone.model';
import type {
  CreateNewMicrophoneBulkRequest,
  CreateNewMicrophoneRequest,
  DeleteAMicrophoneRequest,
  DeleteAllMicrophonesRequest,
  GetMicrophoneByIdRequest,
  GetQueriedMicrophonesRequest,
  UpdateMicrophoneByIdRequest,
} from './microphone.types';

/**
 * Exports
 */

export {
  MicrophoneModel,
  microphoneRouter,
  createNewMicrophoneBulkHandler,
  createNewMicrophoneHandler,
  createNewMicrophoneService,
  deleteAMicrophoneHandler,
  deleteAllMicrophonesHandler,
  deleteAllMicrophonesService,
  deleteAMicrophoneService,
  getMicrophoneByIdHandler,
  getMicrophoneByIdService,
  getQueriedMicrophonesHandler,
  getQueriedMicrophonesService,
  getQueriedTotalMicrophonesService,
  returnAllMicrophonesUploadedFileIdsService,
  returnAllFileUploadsForMicrophonesHandler,
  updateMicrophoneByIdHandler,
  updateMicrophoneByIdService,
};

export type {
  CreateNewMicrophoneBulkRequest,
  CreateNewMicrophoneRequest,
  DeleteAMicrophoneRequest,
  DeleteAllMicrophonesRequest,
  GetMicrophoneByIdRequest,
  GetQueriedMicrophonesRequest,
  MicrophoneDocument,
  MicrophoneSchema,
  UpdateMicrophoneByIdRequest,
};
