import { Router } from "express";
import {
  createNewSurveyHandler,
  getQueriedSurveysHandler,
  getSurveysByUserHandler,
  getSurveyByIdHandler,
  deleteSurveyHandler,
  deleteAllSurveysHandler,
  updateSurveyByIdHandler,
  createNewSurveysBulkHandler,
  updateSurveysBulkHandler,
} from "./survey.controller";

const surveyRouter = Router();

surveyRouter.route("/").get(getQueriedSurveysHandler).post(createNewSurveyHandler);

surveyRouter.route("/delete-all").delete(deleteAllSurveysHandler);

surveyRouter.route("/user").get(getSurveysByUserHandler);

// DEV ROUTES
surveyRouter
  .route("/dev")
  .post(createNewSurveysBulkHandler)
  .patch(updateSurveysBulkHandler);

surveyRouter
  .route("/:surveyId")
  .get(getSurveyByIdHandler)
  .delete(deleteSurveyHandler)
  .patch(updateSurveyByIdHandler);

export { surveyRouter };
