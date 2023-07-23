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
  getQueriedSurveysHandler,
  getSurveyByIdHandler,
  getQueriedSurveysByUserHandler,
} from './surveyBuilder.controller';
import {
  createNewSurveyService,
  deleteASurveyService,
  deleteAllSurveysService,
  getQueriedSurveysService,
  getSurveyByIdService,
  getQueriedSurveysByUserService,
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
  GetQueriedSurveysRequest,
  GetSurveyByIdRequest,
  GetQueriedSurveysByUserRequest,
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
  getQueriedSurveysHandler,
  getSurveyByIdHandler,
  getQueriedSurveysByUserHandler,
  createNewSurveyService,
  deleteASurveyService,
  deleteAllSurveysService,
  getQueriedSurveysService,
  getSurveyByIdService,
  getQueriedSurveysByUserService,
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
  GetQueriedSurveysRequest,
  GetSurveyByIdRequest,
  GetQueriedSurveysByUserRequest,
};
