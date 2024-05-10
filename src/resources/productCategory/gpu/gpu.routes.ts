import { Router } from "express";
import {
  createNewGpuBulkController,
  createNewGpuController,
  deleteAGpuController,
  deleteAllGpusController,
  getGpuByIdController,
  getQueriedGpusController,
  updateGpuByIdController,
  updateGpusBulkController,
} from "./gpu.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createGpuJoiSchema, updateGpuJoiSchema } from "./gpu.validation";

const gpuRouter = Router();

gpuRouter
  .route("/")
  .get(getQueriedGpusController)
  .post(
    validateSchemaMiddleware(createGpuJoiSchema, "gpuSchema"),
    createNewGpuController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
gpuRouter.route("/delete-all").delete(deleteAllGpusController);

// DEV ROUTE
gpuRouter.route("/dev").post(createNewGpuBulkController).patch(updateGpusBulkController);

// single document routes
gpuRouter
  .route("/:gpuId")
  .get(getGpuByIdController)
  .delete(deleteAGpuController)
  .patch(validateSchemaMiddleware(updateGpuJoiSchema), updateGpuByIdController);

export { gpuRouter };
