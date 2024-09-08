import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createDisplayJoiSchema,
  updateDisplayJoiSchema,
} from "./display.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { DisplayModel } from "./display.model";

const displayRouter = Router();

displayRouter
  .route("/")
  // @desc   Get all displays
  // @route  GET api/v1/product-category/display
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(DisplayModel))
  // @desc   Create a new display
  // @route  POST api/v1/product-category/display
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createDisplayJoiSchema, "schema"),
    createNewResourceHandler(DisplayModel),
  );

// @desc   Delete many displays
// @route  DELETE api/v1/product-category/display/delete-many
// @access Private/Admin/Manager
displayRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(DisplayModel),
);

// @desc   Get all displays by user
// @route  GET api/v1/product-category/display/user
// @access Private/Admin/Manager
displayRouter.route("/user").get(
  getQueriedResourcesByUserHandler(DisplayModel),
);

displayRouter
  .route("/:resourceId")
  // @desc   Get a display by its ID
  // @route  GET api/v1/product-category/display/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(DisplayModel))
  // @desc   Delete a display by its ID
  // @route  DELETE api/v1/product-category/display/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(DisplayModel))
  // @desc   Update a display by its ID
  // @route  PATCH api/v1/product-category/display/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateDisplayJoiSchema),
    updateResourceByIdHandler(DisplayModel),
  );

export { displayRouter };
