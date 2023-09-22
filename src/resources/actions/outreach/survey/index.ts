/**
 * This barrel file is used to import/export surveyBuilder model, router, types, handlers and services
 */

/**
 * Imports
 */

import { SurveyBuilderModel } from './survey.model';
import { surveyBuilderRouter } from './survey.routes';
import {
  createNewSurveyHandler,
  deleteASurveyHandler,
  deleteAllSurveysHandler,
  getQueriedSurveysHandler,
  getSurveyByIdHandler,
  getQueriedSurveysByUserHandler,
} from './survey.controller';
import {
  createNewSurveyService,
  deleteASurveyService,
  deleteAllSurveysService,
  getQueriedSurveysService,
  getSurveyByIdService,
  getQueriedSurveysByUserService,
} from './survey.service';

import type {
  SurveyBuilderDocument,
  SurveyBuilderSchema,
  SurveyQuestion,
  SurveyRecipient,
  SurveyResponseKind,
} from './survey.model';
import type {
  CreateNewSurveyRequest,
  DeleteASurveyRequest,
  DeleteAllSurveysRequest,
  GetQueriedSurveysRequest,
  GetSurveyByIdRequest,
  GetQueriedSurveysByUserRequest,
} from './survey.types';

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
