/**
 * This barrel file is used to import/export speaker router, model, types, controllers and services
 */

/**
 * Imports
 */
import { speakerRouter } from './speaker.routes';
import { SpeakerModel } from './speaker.model';

import {
  createNewSpeakerBulkHandler,
  createNewSpeakerHandler,
  deleteASpeakerHandler,
  deleteAllSpeakersHandler,
  getSpeakerByIdHandler,
  getQueriedSpeakersHandler,
  returnAllFileUploadsForSpeakersHandler,
  updateSpeakerByIdHandler,
} from './speaker.controller';

import {
  createNewSpeakerService,
  deleteAllSpeakersService,
  deleteASpeakerService,
  getSpeakerByIdService,
  getQueriedSpeakersService,
  getQueriedTotalSpeakersService,
  returnAllSpeakersUploadedFileIdsService,
  updateSpeakerByIdService,
} from './speaker.service';

import type { SpeakerDocument, SpeakerSchema } from './speaker.model';
import type {
  CreateNewSpeakerBulkRequest,
  CreateNewSpeakerRequest,
  DeleteASpeakerRequest,
  DeleteAllSpeakersRequest,
  GetSpeakerByIdRequest,
  GetQueriedSpeakersRequest,
  UpdateSpeakerByIdRequest,
} from './speaker.types';

/**
 * Exports
 */

export {
  SpeakerModel,
  speakerRouter,
  createNewSpeakerBulkHandler,
  createNewSpeakerHandler,
  createNewSpeakerService,
  deleteASpeakerHandler,
  deleteAllSpeakersHandler,
  deleteAllSpeakersService,
  deleteASpeakerService,
  getSpeakerByIdHandler,
  getSpeakerByIdService,
  getQueriedSpeakersHandler,
  getQueriedSpeakersService,
  getQueriedTotalSpeakersService,
  returnAllSpeakersUploadedFileIdsService,
  returnAllFileUploadsForSpeakersHandler,
  updateSpeakerByIdHandler,
  updateSpeakerByIdService,
};

export type {
  CreateNewSpeakerBulkRequest,
  CreateNewSpeakerRequest,
  DeleteASpeakerRequest,
  DeleteAllSpeakersRequest,
  GetSpeakerByIdRequest,
  GetQueriedSpeakersRequest,
  SpeakerDocument,
  SpeakerSchema,
  UpdateSpeakerByIdRequest,
};
