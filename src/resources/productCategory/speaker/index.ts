/**
 * This barrel file is used to import/export speaker router, model, types, controllers and services
 */

/**
 * Imports
 */
import { speakerRouter } from "./speaker.routes";
import { SpeakerModel } from "./speaker.model";

import {
  createNewSpeakerBulkController,
  createNewSpeakerController,
  deleteASpeakerController,
  deleteAllSpeakersController,
  getSpeakerByIdController,
  getQueriedSpeakersController,
  updateSpeakerByIdController,
  updateSpeakersBulkController,
} from "./speaker.controller";

import {
  createNewSpeakerService,
  deleteASpeakerService,
  deleteAllSpeakersService,
  getSpeakerByIdService,
  getQueriedSpeakersService,
  getQueriedTotalSpeakersService,
  returnAllSpeakersUploadedFileIdsService,
  updateSpeakerByIdService,
} from "./speaker.service";

import type { SpeakerDocument, SpeakerSchema } from "./speaker.model";
import type {
  CreateNewSpeakerBulkRequest,
  CreateNewSpeakerRequest,
  DeleteASpeakerRequest,
  DeleteAllSpeakersRequest,
  GetSpeakerByIdRequest,
  GetQueriedSpeakersRequest,
  UpdateSpeakerByIdRequest,
  UpdateSpeakersBulkRequest,
} from "./speaker.types";

/**
 * Exports
 */

export {
  SpeakerModel,
  speakerRouter,
  createNewSpeakerBulkController,
  createNewSpeakerController,
  createNewSpeakerService,
  deleteASpeakerController,
  deleteASpeakerService,
  deleteAllSpeakersController,
  deleteAllSpeakersService,
  getSpeakerByIdController,
  getSpeakerByIdService,
  getQueriedSpeakersController,
  getQueriedSpeakersService,
  getQueriedTotalSpeakersService,
  returnAllSpeakersUploadedFileIdsService,
  updateSpeakerByIdController,
  updateSpeakerByIdService,
  updateSpeakersBulkController,
};

export type {
  SpeakerDocument,
  SpeakerSchema,
  CreateNewSpeakerBulkRequest,
  CreateNewSpeakerRequest,
  DeleteASpeakerRequest,
  DeleteAllSpeakersRequest,
  GetSpeakerByIdRequest,
  GetQueriedSpeakersRequest,
  UpdateSpeakerByIdRequest,
  UpdateSpeakersBulkRequest,
};
