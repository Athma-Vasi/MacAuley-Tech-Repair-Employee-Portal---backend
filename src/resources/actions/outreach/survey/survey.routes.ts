import { Router } from "express";
import {
  createNewSurveyController,
  getQueriedSurveysController,
  getSurveysByUserController,
  getSurveyByIdController,
  deleteSurveyController,
  deleteAllSurveysController,
  updateSurveyByIdController,
  createNewSurveysBulkController,
  updateSurveysBulkController,
} from "./survey.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import { createSurveyJoiSchema, updateSurveyJoiSchema } from "./survey.validation";

const surveyRouter = Router();

surveyRouter
  .route("/")
  .get(getQueriedSurveysController)
  .post(
    validateSchemaMiddleware(createSurveyJoiSchema, "surveySchema"),
    createNewSurveyController
  );

surveyRouter.route("/delete-all").delete(deleteAllSurveysController);

surveyRouter.route("/user").get(getSurveysByUserController);

// DEV ROUTES
surveyRouter
  .route("/dev")
  .post(createNewSurveysBulkController)
  .patch(updateSurveysBulkController);

surveyRouter
  .route("/:surveyId")
  .get(getSurveyByIdController)
  .delete(deleteSurveyController)
  .patch(validateSchemaMiddleware(updateSurveyJoiSchema), updateSurveyByIdController);

export { surveyRouter };
