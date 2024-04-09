import { Router } from "express";
import {
  createNewPsuBulkHandler,
  createNewPsuHandler,
  deleteAPsuHandler,
  deleteAllPsusHandler,
  getPsuByIdHandler,
  getQueriedPsusHandler,
  updatePsuByIdHandler,
  updatePsusBulkHandler,
} from "./psu.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createPsuJoiSchema, updatePsuJoiSchema } from "./psu.validation";

const psuRouter = Router();

psuRouter
  .route("/")
  .get(getQueriedPsusHandler)
  .post(validateSchemaMiddleware(createPsuJoiSchema, "psuSchema"), createNewPsuHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
psuRouter.route("/delete-all").delete(deleteAllPsusHandler);

// DEV ROUTE
psuRouter.route("/dev").post(createNewPsuBulkHandler).patch(updatePsusBulkHandler);

// single document routes
psuRouter
  .route("/:psuId")
  .get(getPsuByIdHandler)
  .delete(deleteAPsuHandler)
  .patch(validateSchemaMiddleware(updatePsuJoiSchema), updatePsuByIdHandler);

export { psuRouter };
