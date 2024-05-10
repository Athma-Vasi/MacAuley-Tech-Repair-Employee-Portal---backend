import { Router } from "express";
import {
  createNewCpuBulkController,
  createNewCpuController,
  deleteACpuController,
  deleteAllCpusController,
  getCpuByIdController,
  getQueriedCpusController,
  updateCpuByIdController,
  updateCpusBulkController,
} from "./cpu.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createCpuJoiSchema, updateCpuJoiSchema } from "./cpu.validation";

const cpuRouter = Router();

cpuRouter
  .route("/")
  .get(getQueriedCpusController)
  .post(
    validateSchemaMiddleware(createCpuJoiSchema, "cpuSchema"),
    createNewCpuController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
cpuRouter.route("/delete-all").delete(deleteAllCpusController);

// DEV ROUTE
cpuRouter.route("/dev").post(createNewCpuBulkController).patch(updateCpusBulkController);

// single document routes
cpuRouter
  .route("/:cpuId")
  .get(getCpuByIdController)
  .delete(deleteACpuController)
  .patch(validateSchemaMiddleware(updateCpuJoiSchema), updateCpuByIdController);

export { cpuRouter };
