import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createMicrophoneJoiSchema,
  updateMicrophoneJoiSchema,
} from "./microphone.validation";
import {
  createNewResourceHandler,
  deleteAllResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { MicrophoneModel } from "./microphone.model";

const microphoneRouter = Router();

microphoneRouter
  .route("/")
  // @desc   Get all microphones
  // @route  GET api/v1/product-category/microphone
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(MicrophoneModel))
  // @desc   Create a new microphone
  // @route  POST api/v1/product-category/microphone
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createMicrophoneJoiSchema, "schema"),
    createNewResourceHandler(MicrophoneModel),
  );

// @desc   Delete all microphones
// @route  DELETE api/v1/product-category/microphone/delete-all
// @access Private/Admin/Manager
microphoneRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(MicrophoneModel),
);

// @desc   Get all microphones by user
// @route  GET api/v1/product-category/microphone/user
// @access Private/Admin/Manager
microphoneRouter.route("/user").get(
  getQueriedResourcesByUserHandler(MicrophoneModel),
);

microphoneRouter
  .route("/:resourceId")
  // @desc   Get a microphone by its ID
  // @route  GET api/v1/product-category/microphone/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(MicrophoneModel))
  // @desc   Delete a microphone by its ID
  // @route  DELETE api/v1/product-category/microphone/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(MicrophoneModel))
  // @desc   Update a microphone by its ID
  // @route  PATCH api/v1/product-category/microphone/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateMicrophoneJoiSchema),
    updateResourceByIdHandler(MicrophoneModel),
  );

export { microphoneRouter };
