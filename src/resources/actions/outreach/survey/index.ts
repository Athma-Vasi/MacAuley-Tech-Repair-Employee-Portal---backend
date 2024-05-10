/**
 * This barrel file is used to import/export survey model, router, types, handlers and services
 */

/**
 * Imports
 */

import { SurveyModel } from "./survey.model";
import { surveyRouter } from "./survey.routes";
import {
  createNewSurveyController,
  createNewSurveysBulkController,
  deleteAllSurveysController,
  deleteSurveyController,
  getQueriedSurveysController,
  getSurveyByIdController,
  getSurveysByUserController,
  updateSurveyByIdController,
  updateSurveysBulkController,
} from "./survey.controller";
import {
  createNewSurveyService,
  deleteAllSurveysService,
  deleteSurveyByIdService,
  getQueriedSurveysByUserService,
  getQueriedSurveysService,
  getQueriedTotalSurveysService,
  getSurveyByIdService,
  updateSurveyByIdService,
} from "./survey.service";

import type {
  SurveyDocument,
  SurveySchema,
  SurveyQuestion,
  SurveyRecipient,
  SurveyResponseKind,
} from "./survey.model";
import type {
  CreateNewSurveyRequest,
  CreateNewSurveysBulkRequest,
  DeleteAllSurveysRequest,
  DeleteSurveyRequest,
  GetQueriedSurveysByUserRequest,
  GetQueriedSurveysRequest,
  GetSurveyByIdRequest,
  UpdateSurveyByIdRequest,
  UpdateSurveysBulkRequest,
} from "./survey.types";

/**
 * Exports
 */

export {
  SurveyModel,
  surveyRouter,
  createNewSurveyController,
  createNewSurveyService,
  createNewSurveysBulkController,
  deleteAllSurveysController,
  deleteAllSurveysService,
  deleteSurveyByIdService,
  deleteSurveyController,
  getQueriedSurveysByUserService,
  getQueriedSurveysController,
  getQueriedSurveysService,
  getQueriedTotalSurveysService,
  getSurveyByIdController,
  getSurveyByIdService,
  getSurveysByUserController,
  updateSurveyByIdService,
  updateSurveyByIdController,
  updateSurveysBulkController,
};

export type {
  SurveyDocument,
  SurveySchema,
  SurveyQuestion,
  SurveyRecipient,
  SurveyResponseKind,
  CreateNewSurveyRequest,
  CreateNewSurveysBulkRequest,
  DeleteAllSurveysRequest,
  DeleteSurveyRequest,
  GetQueriedSurveysByUserRequest,
  GetQueriedSurveysRequest,
  GetSurveyByIdRequest,
  UpdateSurveyByIdRequest,
  UpdateSurveysBulkRequest,
};
