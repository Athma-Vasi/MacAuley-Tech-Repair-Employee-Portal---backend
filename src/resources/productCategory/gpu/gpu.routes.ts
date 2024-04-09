import { Router } from "express";
import {
  createNewGpuBulkHandler,
  createNewGpuHandler,
  deleteAGpuHandler,
  deleteAllGpusHandler,
  getGpuByIdHandler,
  getQueriedGpusHandler,
  updateGpuByIdHandler,
  updateGpusBulkHandler,
} from "./gpu.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createGpuJoiSchema, updateGpuJoiSchema } from "./gpu.validation";

const gpuRouter = Router();

gpuRouter
  .route("/")
  .get(getQueriedGpusHandler)
  .post(validateSchemaMiddleware(createGpuJoiSchema, "gpuSchema"), createNewGpuHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
gpuRouter.route("/delete-all").delete(deleteAllGpusHandler);

// DEV ROUTE
gpuRouter.route("/dev").post(createNewGpuBulkHandler).patch(updateGpusBulkHandler);

// single document routes
gpuRouter
  .route("/:gpuId")
  .get(getGpuByIdHandler)
  .delete(deleteAGpuHandler)
  .patch(validateSchemaMiddleware(updateGpuJoiSchema), updateGpuByIdHandler);

export { gpuRouter };
