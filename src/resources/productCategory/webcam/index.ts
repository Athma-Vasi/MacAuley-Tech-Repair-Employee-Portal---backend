/**
 * This barrel file is used to import/export webcam router, model, types, controllers and services
 */

/**
 * Imports
 */
import { webcamRouter } from "./webcam.routes";
import { WebcamModel } from "./webcam.model";

import {
  createNewWebcamBulkController,
  createNewWebcamController,
  deleteAWebcamController,
  deleteAllWebcamsController,
  getWebcamByIdController,
  getQueriedWebcamsController,
  updateWebcamByIdController,
  updateWebcamsBulkController,
} from "./webcam.controller";

import {
  createNewWebcamService,
  deleteAWebcamService,
  deleteAllWebcamsService,
  getWebcamByIdService,
  getQueriedWebcamsService,
  getQueriedTotalWebcamsService,
  returnAllWebcamsUploadedFileIdsService,
  updateWebcamByIdService,
} from "./webcam.service";

import type { WebcamDocument, WebcamSchema } from "./webcam.model";
import type {
  CreateNewWebcamBulkRequest,
  CreateNewWebcamRequest,
  DeleteAWebcamRequest,
  DeleteAllWebcamsRequest,
  GetWebcamByIdRequest,
  GetQueriedWebcamsRequest,
  UpdateWebcamByIdRequest,
  UpdateWebcamsBulkRequest,
} from "./webcam.types";

/**
 * Exports
 */

export {
  WebcamModel,
  webcamRouter,
  createNewWebcamBulkController,
  createNewWebcamController,
  createNewWebcamService,
  deleteAWebcamController,
  deleteAWebcamService,
  deleteAllWebcamsController,
  deleteAllWebcamsService,
  getWebcamByIdController,
  getWebcamByIdService,
  getQueriedWebcamsController,
  getQueriedWebcamsService,
  getQueriedTotalWebcamsService,
  returnAllWebcamsUploadedFileIdsService,
  updateWebcamByIdController,
  updateWebcamByIdService,
  updateWebcamsBulkController,
};

export type {
  WebcamDocument,
  WebcamSchema,
  CreateNewWebcamBulkRequest,
  CreateNewWebcamRequest,
  DeleteAWebcamRequest,
  DeleteAllWebcamsRequest,
  GetWebcamByIdRequest,
  GetQueriedWebcamsRequest,
  UpdateWebcamByIdRequest,
  UpdateWebcamsBulkRequest,
};
