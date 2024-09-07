import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createCpuJoiSchema, updateCpuJoiSchema } from "./cpu.validation";
import {
  createNewResourceHandler,
  deleteAllResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { CpuModel } from "./cpu.model";

const cpuRouter = Router();

cpuRouter
  .route("/")
  // @desc   Get all cpus
  // @route  GET api/v1/product-category/cpu
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(CpuModel))
  // @desc   Create a new cpu
  // @route  POST api/v1/product-category/cpu
  // @access Private/Admin/Manager
  .post(
    validateSchemaMiddleware(createCpuJoiSchema, "schema"),
    createNewResourceHandler(CpuModel),
  );

// @desc   Delete all cpus
// @route  DELETE api/v1/product-category/cpu/delete-all
// @access Private/Admin/Manager
cpuRouter.route("/delete-all").delete(
  deleteAllResourcesHandler(CpuModel),
);

// @desc   Get all cpus by user
// @route  GET api/v1/product-category/cpu/user
// @access Private/Admin/Manager
cpuRouter.route("/user").get(
  getQueriedResourcesByUserHandler(CpuModel),
);

cpuRouter
  .route("/:resourceId")
  // @desc   Get a cpu by its ID
  // @route  GET api/v1/product-category/cpu/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(CpuModel))
  // @desc   Delete a cpu by its ID
  // @route  DELETE api/v1/product-category/cpu/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(CpuModel))
  // @desc   Update a cpu by its ID
  // @route  PATCH api/v1/product-category/cpu/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateCpuJoiSchema),
    updateResourceByIdHandler(CpuModel),
  );

export { cpuRouter };
