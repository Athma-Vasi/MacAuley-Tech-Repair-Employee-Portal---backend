import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createRamJoiSchema, updateRamJoiSchema } from "./ram.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { RamModel } from "./ram.model";

const ramRouter = Router();

ramRouter
  .route("/")
  // @desc   Get all rams
  // @route  GET api/v1/product-category/ram
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(RamModel))
  // @desc   Create a new ram
  // @route  POST api/v1/product-category/ram
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createRamJoiSchema, "schema"),
    createNewResourceHandler(RamModel),
  );

// @desc   Delete many rams
// @route  DELETE api/v1/product-category/ram/delete-many
// @access Private/Admin/Manager
ramRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(RamModel),
);

// @desc   Get all rams by user
// @route  GET api/v1/product-category/ram/user
// @access Private/Admin/Manager
ramRouter.route("/user").get(
  getQueriedResourcesByUserHandler(RamModel),
);

ramRouter
  .route("/:resourceId")
  // @desc   Get a ram by its ID
  // @route  GET api/v1/product-category/ram/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(RamModel))
  // @desc   Delete a ram by its ID
  // @route  DELETE api/v1/product-category/ram/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(RamModel))
  // @desc   Update a ram by its ID
  // @route  PATCH api/v1/product-category/ram/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateRamJoiSchema),
    updateResourceByIdHandler(RamModel),
  );

export { ramRouter };
