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

const gpuRouter = Router();

gpuRouter.route("/").get(getQueriedGpusHandler).post(createNewGpuHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
gpuRouter.route("/delete-all").delete(deleteAllGpusHandler);

// DEV ROUTE
gpuRouter.route("/dev").post(createNewGpuBulkHandler).patch(updateGpusBulkHandler);

// single document routes
gpuRouter
  .route("/:gpuId")
  .get(getGpuByIdHandler)
  .delete(deleteAGpuHandler)
  .patch(updateGpuByIdHandler);

export { gpuRouter };
