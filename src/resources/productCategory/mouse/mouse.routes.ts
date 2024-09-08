import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createMouseJoiSchema, updateMouseJoiSchema } from "./mouse.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { MouseModel } from "./mouse.model";

const mouseRouter = Router();

mouseRouter
  .route("/")
  // @desc   Get all mouses
  // @route  GET api/v1/product-category/mouse
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(MouseModel))
  // @desc   Create a new mouse
  // @route  POST api/v1/product-category/mouse
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createMouseJoiSchema, "schema"),
    createNewResourceHandler(MouseModel),
  );

// @desc   Delete many mouses
// @route  DELETE api/v1/product-category/mouse/delete-many
// @access Private/Admin/Manager
mouseRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(MouseModel),
);

// @desc   Get all mouses by user
// @route  GET api/v1/product-category/mouse/user
// @access Private/Admin/Manager
mouseRouter.route("/user").get(
  getQueriedResourcesByUserHandler(MouseModel),
);

mouseRouter
  .route("/:resourceId")
  // @desc   Get a mouse by its ID
  // @route  GET api/v1/product-category/mouse/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(MouseModel))
  // @desc   Delete a mouse by its ID
  // @route  DELETE api/v1/product-category/mouse/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(MouseModel))
  // @desc   Update a mouse by its ID
  // @route  PATCH api/v1/product-category/mouse/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateMouseJoiSchema),
    updateResourceByIdHandler(MouseModel),
  );

export { mouseRouter };
