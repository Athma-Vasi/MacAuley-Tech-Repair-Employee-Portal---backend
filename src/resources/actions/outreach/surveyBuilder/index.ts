/**
 * This barrel file is used to import/export surveyBuilder model, router, types, handlers and services
 */

/**
 * Imports
 */

import { SurveyBuilderModel } from './surveyBuilder.model';
import { surveyBuilderRouter } from './surveyBuilder.routes';
import {
  createNewSurveyHandler,
  deleteASurveyHandler,
  deleteAllSurveysHandler,
  getAllSurveysHandler,
  getSurveyByIdHandler,
  getSurveysByUserHandler,
} from './surveyBuilder.controller';
import {
  createNewSurveyService,
  deleteASurveyService,
  deleteAllSurveysService,
  getAllSurveysService,
  getSurveyByIdService,
  getSurveysByUserService,
} from './surveyBuilder.service';

import type {
  SurveyBuilderDocument,
  SurveyBuilderSchema,
  SurveyQuestion,
  SurveyRecipient,
  SurveyResponseKind,
} from './surveyBuilder.model';
import type {
  CreateNewSurveyRequest,
  DeleteASurveyRequest,
  DeleteAllSurveysRequest,
  GetAllSurveysRequest,
  GetSurveyByIdRequest,
  GetSurveysByUserRequest,
  SurveyServerResponse,
} from './surveyBuilder.types';

/**
 * Exports
 */

export {
  SurveyBuilderModel,
  surveyBuilderRouter,
  createNewSurveyHandler,
  deleteASurveyHandler,
  deleteAllSurveysHandler,
  getAllSurveysHandler,
  getSurveyByIdHandler,
  getSurveysByUserHandler,
  createNewSurveyService,
  deleteASurveyService,
  deleteAllSurveysService,
  getAllSurveysService,
  getSurveyByIdService,
  getSurveysByUserService,
};

export type {
  SurveyBuilderDocument,
  SurveyBuilderSchema,
  SurveyQuestion,
  SurveyRecipient,
  SurveyResponseKind,
  CreateNewSurveyRequest,
  DeleteASurveyRequest,
  DeleteAllSurveysRequest,
  GetAllSurveysRequest,
  GetSurveyByIdRequest,
  GetSurveysByUserRequest,
  SurveyServerResponse,
};
