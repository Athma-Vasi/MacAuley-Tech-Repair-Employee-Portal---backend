import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createStorageJoiSchema,
  updateStorageJoiSchema,
} from "./storage.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { StorageModel } from "./storage.model";

const storageRouter = Router();

storageRouter
  .route("/")
  // @desc   Get all storages
  // @route  GET api/v1/product-category/storage
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(StorageModel))
  // @desc   Create a new storage
  // @route  POST api/v1/product-category/storage
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createStorageJoiSchema, "schema"),
    createNewResourceHandler(StorageModel),
  );

// @desc   Delete many storages
// @route  DELETE api/v1/product-category/storage/delete-many
// @access Private/Admin/Manager
storageRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(StorageModel),
);

// @desc   Get all storages by user
// @route  GET api/v1/product-category/storage/user
// @access Private/Admin/Manager
storageRouter.route("/user").get(
  getQueriedResourcesByUserHandler(StorageModel),
);

storageRouter
  .route("/:resourceId")
  // @desc   Get a storage by its ID
  // @route  GET api/v1/product-category/storage/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(StorageModel))
  // @desc   Delete a storage by its ID
  // @route  DELETE api/v1/product-category/storage/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(StorageModel))
  // @desc   Update a storage by its ID
  // @route  PATCH api/v1/product-category/storage/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateStorageJoiSchema),
    updateResourceByIdHandler(StorageModel),
  );

export { storageRouter };
