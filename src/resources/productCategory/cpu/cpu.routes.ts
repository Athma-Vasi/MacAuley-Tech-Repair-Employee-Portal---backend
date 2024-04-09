import { Router } from "express";
import {
  createNewCpuBulkHandler,
  createNewCpuHandler,
  deleteACpuHandler,
  deleteAllCpusHandler,
  getCpuByIdHandler,
  getQueriedCpusHandler,
  updateCpuByIdHandler,
  updateCpusBulkHandler,
} from "./cpu.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createCpuJoiSchema, updateCpuJoiSchema } from "./cpu.validation";

const cpuRouter = Router();

cpuRouter
  .route("/")
  .get(getQueriedCpusHandler)
  .post(validateSchemaMiddleware(createCpuJoiSchema, "cpuSchema"), createNewCpuHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
cpuRouter.route("/delete-all").delete(deleteAllCpusHandler);

// DEV ROUTE
cpuRouter.route("/dev").post(createNewCpuBulkHandler).patch(updateCpusBulkHandler);

// single document routes
cpuRouter
  .route("/:cpuId")
  .get(getCpuByIdHandler)
  .delete(deleteACpuHandler)
  .patch(validateSchemaMiddleware(updateCpuJoiSchema), updateCpuByIdHandler);

export { cpuRouter };
