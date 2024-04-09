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
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import { createSurveyJoiSchema, updateSurveyJoiSchema } from "./survey.validation";

const surveyRouter = Router();

surveyRouter
  .route("/")
  .get(getQueriedSurveysHandler)
  .post(
    validateSchemaMiddleware(createSurveyJoiSchema, "surveySchema"),
    createNewSurveyHandler
  );

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
  .patch(validateSchemaMiddleware(updateSurveyJoiSchema), updateSurveyByIdHandler);

export { surveyRouter };
