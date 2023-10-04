import { Router } from 'express';

import {
  createNewSurveyHandler,
  deleteASurveyHandler,
  deleteAllSurveysHandler,
  getQueriedSurveysHandler,
  getSurveyByIdHandler,
  getQueriedSurveysByUserHandler,
  updateSurveyStatisticsByIdHandler,
  createNewSurveysBulkHandler,
} from './survey.controller';
import { assignQueryDefaults, verifyRoles } from '../../../../middlewares';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../constants';

const surveyBuilderRouter = Router();

surveyBuilderRouter.use(verifyRoles());

surveyBuilderRouter
  .route('/')
  .post(createNewSurveyHandler)
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedSurveysHandler)
  .delete(deleteAllSurveysHandler);

surveyBuilderRouter
  .route('/user')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedSurveysByUserHandler);

// DEV ROUTE
surveyBuilderRouter.route('/dev').post(createNewSurveysBulkHandler);

surveyBuilderRouter
  .route('/:surveyId')
  .get(getSurveyByIdHandler)
  .delete(deleteASurveyHandler)
  .patch(updateSurveyStatisticsByIdHandler);

export { surveyBuilderRouter };
