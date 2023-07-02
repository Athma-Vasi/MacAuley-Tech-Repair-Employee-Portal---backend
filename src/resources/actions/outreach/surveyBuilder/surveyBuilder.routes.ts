import { Router } from 'express';

import {
  createNewSurveyHandler,
  deleteASurveyHandler,
  deleteAllSurveysHandler,
  getAllSurveysHandler,
  getSurveyByIdHandler,
  getSurveysByUserHandler,
} from './surveyBuilder.controller';

const surveyBuilderRouter = Router();

surveyBuilderRouter
  .route('/')
  .post(createNewSurveyHandler)
  .get(getAllSurveysHandler)
  .delete(deleteAllSurveysHandler);

surveyBuilderRouter.route('/:surveyId').get(getSurveyByIdHandler).delete(deleteASurveyHandler);

surveyBuilderRouter.route('/user').get(getSurveysByUserHandler);

export { surveyBuilderRouter };
