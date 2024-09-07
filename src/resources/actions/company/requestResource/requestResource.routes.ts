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
  // @desc   Get all requestResources
  // @route  GET api/v1/actions/company/request-resource
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(RequestResourceModel))
  // @desc   Create a new requestResource
  // @route  POST api/v1/actions/company/request-resource
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createRequestResourceJoiSchema, "schema"),
    createNewResourceHandler(RequestResourceModel),
  );

// @desc   Delete all requestResources
// @route  DELETE api/v1/actions/company/request-resource/delete-all
// @access Private/Admin/Manager
requestResourceRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(RequestResourceModel),
);

// @desc   Get all requestResources by user
// @route  GET api/v1/actions/company/request-resource/user
// @access Private/Admin/Manager
requestResourceRouter.route("/user").get(
  getQueriedResourcesByUserHandler(RequestResourceModel),
);

requestResourceRouter
  .route("/:resourceId")
  // @desc   Get a requestResource by ID
  // @route  GET api/v1/actions/company/request-resource/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(RequestResourceModel))
  // @desc   Delete a requestResource by ID
  // @route  DELETE api/v1/actions/company/request-resource/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(RequestResourceModel))
  // @desc   Update a requestResource by ID
  // @route  PATCH api/v1/actions/company/request-resource/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateRequestResourceJoiSchema),
    updateResourceByIdHandler(RequestResourceModel),
  );

export { requestResourceRouter };
