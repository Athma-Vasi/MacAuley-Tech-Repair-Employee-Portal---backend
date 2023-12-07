/**
 * This barrel file is used to import/export survey model, router, types, handlers and services
 */

/**
 * Imports
 */

import { SurveyModel } from "./survey.model";
import { surveyRouter } from "./survey.routes";
import {
  createNewSurveyHandler,
  createNewSurveysBulkHandler,
  deleteAllSurveysHandler,
  deleteSurveyHandler,
  getQueriedSurveysHandler,
  getSurveyByIdHandler,
  getSurveysByUserHandler,
  updateSurveyByIdHandler,
  updateSurveysBulkHandler,
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
  createNewSurveyHandler,
  createNewSurveyService,
  createNewSurveysBulkHandler,
  deleteAllSurveysHandler,
  deleteAllSurveysService,
  deleteSurveyByIdService,
  deleteSurveyHandler,
  getQueriedSurveysByUserService,
  getQueriedSurveysHandler,
  getQueriedSurveysService,
  getQueriedTotalSurveysService,
  getSurveyByIdHandler,
  getSurveyByIdService,
  getSurveysByUserHandler,
  updateSurveyByIdService,
  updateSurveyByIdHandler,
  updateSurveysBulkHandler,
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
