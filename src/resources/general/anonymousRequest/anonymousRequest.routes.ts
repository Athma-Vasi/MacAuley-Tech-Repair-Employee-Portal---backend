import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createAnonymousRequestJoiSchema,
  updateAnonymousRequestJoiSchema,
} from "./anonymousRequest.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { AnonymousRequestModel } from "./anonymousRequest.model";

const anonymousRequestRouter = Router();

anonymousRequestRouter
  .route("/")
  // @desc   Get all anonymousRequests
  // @route  GET api/v1/general/anonymous-request
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(AnonymousRequestModel))
  // @desc   Create a new anonymousRequest
  // @route  POST api/v1/general/anonymous-request
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createAnonymousRequestJoiSchema, "schema"),
    createNewResourceHandler(AnonymousRequestModel),
  );

// @desc   Delete many anonymousRequests
// @route  DELETE api/v1/general/anonymous-request/delete-many
// @access Private/Admin/Manager
anonymousRequestRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(AnonymousRequestModel),
);

// @desc   Get all anonymousRequests by user
// @route  GET api/v1/general/anonymous-request/user
// @access Private/Admin/Manager
anonymousRequestRouter.route("/user").get(
  getQueriedResourcesByUserHandler(AnonymousRequestModel),
);

anonymousRequestRouter
  .route("/:resourceId")
  // @desc   Get an anonymousRequest by its ID
  // @route  GET api/v1/general/anonymous-request/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(AnonymousRequestModel))
  // @desc   Delete an anonymousRequest by its ID
  // @route  DELETE api/v1/general/anonymous-request/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(AnonymousRequestModel))
  // @desc   Update an anonymousRequest by its ID
  // @route  PATCH api/v1/general/anonymous-request/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateAnonymousRequestJoiSchema),
    updateResourceByIdHandler(AnonymousRequestModel),
  );

export { anonymousRequestRouter };
