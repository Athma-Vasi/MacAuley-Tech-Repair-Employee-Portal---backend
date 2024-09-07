import { Router } from "express";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createRequestResourceJoiSchema,
  updateRequestResourceJoiSchema,
} from "./requestResource.validation";
import {
  createNewResourceHandler,
  deleteAllResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../../handlers";
import { RequestResourceModel } from "./requestResource.model";

const requestResourceRouter = Router();

requestResourceRouter
  .route("/")
  // @desc   Get all requestResource plans
  // @route  GET api/v1/actions/company/requestResource
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(RequestResourceModel))
  // @desc   Create a new requestResource plan
  // @route  POST api/v1/actions/company/requestResource
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createRequestResourceJoiSchema, "schema"),
    createNewResourceHandler(RequestResourceModel),
  );

// @desc   Delete all requestResource plans
// @route  DELETE api/v1/actions/company/request-resource/delete-all
// @access Private/Admin/Manager
requestResourceRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(RequestResourceModel),
);

// @desc   Get all requestResource plans by user
// @route  GET api/v1/actions/company/request-resource/user
// @access Private/Admin/Manager
requestResourceRouter.route("/user").get(
  getQueriedResourcesByUserHandler(RequestResourceModel),
);

requestResourceRouter
  .route("/:resourceId")
  // @desc   Get a requestResource plan by ID
  // @route  GET api/v1/actions/company/request-resource/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(RequestResourceModel))
  // @desc   Delete a requestResource plan by ID
  // @route  DELETE api/v1/actions/company/request-resource/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(RequestResourceModel))
  // @desc   Update a requestResource plan by ID
  // @route  PATCH api/v1/actions/company/request-resource/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateRequestResourceJoiSchema),
    updateResourceByIdHandler(RequestResourceModel),
  );

export { requestResourceRouter };
