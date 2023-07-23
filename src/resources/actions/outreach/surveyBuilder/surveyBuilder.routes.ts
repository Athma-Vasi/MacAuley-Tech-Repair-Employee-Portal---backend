import { Router } from 'express';

import {
  createNewSurveyHandler,
  deleteASurveyHandler,
  deleteAllSurveysHandler,
  getQueriedSurveysHandler,
  getSurveyByIdHandler,
  getQueriedSurveysByUserHandler,
} from './surveyBuilder.controller';
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

surveyBuilderRouter.route('/:surveyId').get(getSurveyByIdHandler).delete(deleteASurveyHandler);

export { surveyBuilderRouter };
