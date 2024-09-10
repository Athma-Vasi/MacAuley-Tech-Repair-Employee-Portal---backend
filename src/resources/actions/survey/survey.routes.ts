import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createSurveyJoiSchema,
  updateSurveyJoiSchema,
} from "./survey.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { SurveyModel } from "./survey.model";

const surveyRouter = Router();

surveyRouter
  .route("/")
  // @desc   Get all surveys
  // @route  GET api/v1/outreach/survey
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(SurveyModel))
  // @desc   Create a new survey
  // @route  POST api/v1/outreach/survey
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createSurveyJoiSchema, "schema"),
    createNewResourceHandler(SurveyModel),
  );

// @desc   Delete many surveys
// @route  DELETE api/v1/outreach/survey/delete-many
// @access Private/Admin/Manager
surveyRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(SurveyModel),
);

// @desc   Get all surveys by user
// @route  GET api/v1/outreach/survey/user
// @access Private/Admin/Manager
surveyRouter.route("/user").get(
  getQueriedResourcesByUserHandler(SurveyModel),
);

surveyRouter
  .route("/:resourceId")
  // @desc   Get a survey by its ID
  // @route  GET api/v1/outreach/survey/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(SurveyModel))
  // @desc   Delete a survey by its ID
  // @route  DELETE api/v1/outreach/survey/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(SurveyModel))
  // @desc   Update a survey by its ID
  // @route  PATCH api/v1/outreach/survey/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateSurveyJoiSchema),
    updateResourceByIdHandler(SurveyModel),
  );

export { surveyRouter };
