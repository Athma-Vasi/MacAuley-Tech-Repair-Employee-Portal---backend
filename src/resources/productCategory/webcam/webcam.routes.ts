import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createWebcamJoiSchema,
  updateWebcamJoiSchema,
} from "./webcam.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { WebcamModel } from "./webcam.model";

const webcamRouter = Router();

webcamRouter
  .route("/")
  // @desc   Get all webcams
  // @route  GET api/v1/product-category/webcam
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(WebcamModel))
  // @desc   Create a new webcam
  // @route  POST api/v1/product-category/webcam
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createWebcamJoiSchema, "schema"),
    createNewResourceHandler(WebcamModel),
  );

// @desc   Delete many webcams
// @route  DELETE api/v1/product-category/webcam/delete-many
// @access Private/Admin/Manager
webcamRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(WebcamModel),
);

// @desc   Get all webcams by user
// @route  GET api/v1/product-category/webcam/user
// @access Private/Admin/Manager
webcamRouter.route("/user").get(
  getQueriedResourcesByUserHandler(WebcamModel),
);

webcamRouter
  .route("/:resourceId")
  // @desc   Get a webcam by its ID
  // @route  GET api/v1/product-category/webcam/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(WebcamModel))
  // @desc   Delete a webcam by its ID
  // @route  DELETE api/v1/product-category/webcam/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(WebcamModel))
  // @desc   Update a webcam by its ID
  // @route  PATCH api/v1/product-category/webcam/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateWebcamJoiSchema),
    updateResourceByIdHandler(WebcamModel),
  );

export { webcamRouter };
