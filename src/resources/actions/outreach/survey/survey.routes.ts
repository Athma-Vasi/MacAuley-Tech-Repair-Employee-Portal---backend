import { Router } from "express";
import {
  createNewSurveyHandler,
  getQueriedSurveysHandler,
  getSurveysByUserHandler,
  getSurveyByIdHandler,
  deleteSurveyHandler,
  deleteAllSurveysHandler,
  updateSurveyStatusByIdHandler,
  createNewSurveysBulkHandler,
  updateSurveysBulkHandler,
} from "./survey.controller";
import { assignQueryDefaults } from "../../../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../../constants";

const surveyRouter = Router();

surveyRouter
  .route("/")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedSurveysHandler)
  .post(createNewSurveyHandler);

surveyRouter.route("/delete-all").delete(deleteAllSurveysHandler);

surveyRouter
  .route("/user")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getSurveysByUserHandler);

// DEV ROUTES
surveyRouter
  .route("/dev")
  .post(createNewSurveysBulkHandler)
  .patch(updateSurveysBulkHandler);

surveyRouter
  .route("/:surveyId")
  .get(getSurveyByIdHandler)
  .delete(deleteSurveyHandler)
  .patch(updateSurveyStatusByIdHandler);

export { surveyRouter };
