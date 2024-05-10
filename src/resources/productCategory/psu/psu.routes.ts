import { Router } from "express";
import {
  createNewPsuBulkController,
  createNewPsuController,
  deleteAPsuController,
  deleteAllPsusController,
  getPsuByIdController,
  getQueriedPsusController,
  updatePsuByIdController,
  updatePsusBulkController,
} from "./psu.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createPsuJoiSchema, updatePsuJoiSchema } from "./psu.validation";

const psuRouter = Router();

psuRouter
  .route("/")
  .get(getQueriedPsusController)
  .post(
    validateSchemaMiddleware(createPsuJoiSchema, "psuSchema"),
    createNewPsuController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
psuRouter.route("/delete-all").delete(deleteAllPsusController);

// DEV ROUTE
psuRouter.route("/dev").post(createNewPsuBulkController).patch(updatePsusBulkController);

// single document routes
psuRouter
  .route("/:psuId")
  .get(getPsuByIdController)
  .delete(deleteAPsuController)
  .patch(validateSchemaMiddleware(updatePsuJoiSchema), updatePsuByIdController);

export { psuRouter };
