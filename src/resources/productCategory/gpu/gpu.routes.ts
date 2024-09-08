import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createGpuJoiSchema, updateGpuJoiSchema } from "./gpu.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { GpuModel } from "./gpu.model";

const gpuRouter = Router();

gpuRouter
  .route("/")
  // @desc   Get all gpus
  // @route  GET api/v1/product-category/gpu
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(GpuModel))
  // @desc   Create a new gpu
  // @route  POST api/v1/product-category/gpu
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createGpuJoiSchema, "schema"),
    createNewResourceHandler(GpuModel),
  );

// @desc   Delete many gpus
// @route  DELETE api/v1/product-category/gpu/delete-many
// @access Private/Admin/Manager
gpuRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(GpuModel),
);

// @desc   Get all gpus by user
// @route  GET api/v1/product-category/gpu/user
// @access Private/Admin/Manager
gpuRouter.route("/user").get(
  getQueriedResourcesByUserHandler(GpuModel),
);

gpuRouter
  .route("/:resourceId")
  // @desc   Get a gpu by its ID
  // @route  GET api/v1/product-category/gpu/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(GpuModel))
  // @desc   Delete a gpu by its ID
  // @route  DELETE api/v1/product-category/gpu/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(GpuModel))
  // @desc   Update a gpu by its ID
  // @route  PATCH api/v1/product-category/gpu/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateGpuJoiSchema),
    updateResourceByIdHandler(GpuModel),
  );

export { gpuRouter };
