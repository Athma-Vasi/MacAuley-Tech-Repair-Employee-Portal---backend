/**
 * This barrel file is used to import/export webcam router, model, types, controllers and services
 */

/**
 * Imports
 */
import { webcamRouter } from './webcam.routes';
import { WebcamModel } from './webcam.model';

import {
  createNewWebcamBulkHandler,
  createNewWebcamHandler,
  deleteAWebcamHandler,
  deleteAllWebcamsHandler,
  getWebcamByIdHandler,
  getQueriedWebcamsHandler,
  returnAllFileUploadsForWebcamsHandler,
  updateWebcamByIdHandler,
} from './webcam.controller';

import {
  createNewWebcamService,
  deleteAllWebcamsService,
  deleteAWebcamService,
  getWebcamByIdService,
  getQueriedWebcamsService,
  getQueriedTotalWebcamsService,
  returnAllWebcamsUploadedFileIdsService,
  updateWebcamByIdService,
} from './webcam.service';

import type { WebcamDocument, WebcamSchema } from './webcam.model';
import type {
  CreateNewWebcamBulkRequest,
  CreateNewWebcamRequest,
  DeleteAWebcamRequest,
  DeleteAllWebcamsRequest,
  GetWebcamByIdRequest,
  GetQueriedWebcamsRequest,
  UpdateWebcamByIdRequest,
} from './webcam.types';

/**
 * Exports
 */

export {
  WebcamModel,
  webcamRouter,
  createNewWebcamBulkHandler,
  createNewWebcamHandler,
  createNewWebcamService,
  deleteAWebcamHandler,
  deleteAllWebcamsHandler,
  deleteAllWebcamsService,
  deleteAWebcamService,
  getWebcamByIdHandler,
  getWebcamByIdService,
  getQueriedWebcamsHandler,
  getQueriedWebcamsService,
  getQueriedTotalWebcamsService,
  returnAllWebcamsUploadedFileIdsService,
  returnAllFileUploadsForWebcamsHandler,
  updateWebcamByIdHandler,
  updateWebcamByIdService,
};

export type {
  CreateNewWebcamBulkRequest,
  CreateNewWebcamRequest,
  DeleteAWebcamRequest,
  DeleteAllWebcamsRequest,
  GetWebcamByIdRequest,
  GetQueriedWebcamsRequest,
  WebcamDocument,
  WebcamSchema,
  UpdateWebcamByIdRequest,
};
