import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createHeadphoneJoiSchema,
  updateHeadphoneJoiSchema,
} from "./headphone.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { HeadphoneModel } from "./headphone.model";

const headphoneRouter = Router();

headphoneRouter
  .route("/")
  // @desc   Get all headphones
  // @route  GET api/v1/product-category/headphone
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(HeadphoneModel))
  // @desc   Create a new headphone
  // @route  POST api/v1/product-category/headphone
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createHeadphoneJoiSchema, "schema"),
    createNewResourceHandler(HeadphoneModel),
  );

// @desc   Delete many headphones
// @route  DELETE api/v1/product-category/headphone/delete-many
// @access Private/Admin/Manager
headphoneRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(HeadphoneModel),
);

// @desc   Get all headphones by user
// @route  GET api/v1/product-category/headphone/user
// @access Private/Admin/Manager
headphoneRouter.route("/user").get(
  getQueriedResourcesByUserHandler(HeadphoneModel),
);

headphoneRouter
  .route("/:resourceId")
  // @desc   Get a headphone by its ID
  // @route  GET api/v1/product-category/headphone/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(HeadphoneModel))
  // @desc   Delete a headphone by its ID
  // @route  DELETE api/v1/product-category/headphone/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(HeadphoneModel))
  // @desc   Update a headphone by its ID
  // @route  PATCH api/v1/product-category/headphone/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateHeadphoneJoiSchema),
    updateResourceByIdHandler(HeadphoneModel),
  );

export { headphoneRouter };
