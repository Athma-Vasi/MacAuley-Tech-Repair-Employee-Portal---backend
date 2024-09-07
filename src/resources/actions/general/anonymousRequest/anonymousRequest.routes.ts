import { Router } from "express";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createAnonymousRequestJoiSchema,
  updateAnonymousRequestJoiSchema,
} from "./anonymousRequest.validation";
import {
  createNewResourceHandler,
  deleteAllResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../../handlers";
import { AnonymousRequestModel } from "./anonymousRequest.model";

const anonymousRequestRouter = Router();

anonymousRequestRouter
  .route("/")
  // @desc   Get all anonymousRequests plans
  // @route  GET api/v1/actions/general/anonymous-request
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(AnonymousRequestModel))
  // @desc   Create a new anonymousRequests plan
  // @route  POST api/v1/actions/general/anonymous-request
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createAnonymousRequestJoiSchema, "schema"),
    createNewResourceHandler(AnonymousRequestModel),
  );

// @desc   Delete all anonymousRequests plans
// @route  DELETE api/v1/actions/general/anonymous-request/delete-all
// @access Private/Admin/Manager
anonymousRequestRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(AnonymousRequestModel),
);

// @desc   Get all anonymousRequests plans by user
// @route  GET api/v1/actions/general/anonymous-request/user
// @access Private/Admin/Manager
anonymousRequestRouter.route("/user").get(
  getQueriedResourcesByUserHandler(AnonymousRequestModel),
);

anonymousRequestRouter
  .route("/:resourceId")
  // @desc   Get a anonymousRequests plan by ID
  // @route  GET api/v1/actions/general/anonymous-request/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(AnonymousRequestModel))
  // @desc   Delete a anonymousRequests plan by ID
  // @route  DELETE api/v1/actions/general/anonymous-request/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(AnonymousRequestModel))
  // @desc   Update a anonymousRequests plan by ID
  // @route  PATCH api/v1/actions/general/anonymous-request/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateAnonymousRequestJoiSchema),
    updateResourceByIdHandler(AnonymousRequestModel),
  );

export { anonymousRequestRouter };
