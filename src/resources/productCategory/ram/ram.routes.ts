import { Router } from "express";
import {
  createNewRamBulkHandler,
  createNewRamHandler,
  deleteARamHandler,
  deleteAllRamsHandler,
  getRamByIdHandler,
  getQueriedRamsHandler,
  updateRamByIdHandler,
  updateRamsBulkHandler,
} from "./ram.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createRamJoiSchema, updateRamJoiSchema } from "./ram.validation";

const ramRouter = Router();

ramRouter
  .route("/")
  .get(getQueriedRamsHandler)
  .post(validateSchemaMiddleware(createRamJoiSchema, "ramSchema"), createNewRamHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
ramRouter.route("/delete-all").delete(deleteAllRamsHandler);

// DEV ROUTE
ramRouter.route("/dev").post(createNewRamBulkHandler).patch(updateRamsBulkHandler);

// single document routes
ramRouter
  .route("/:ramId")
  .get(getRamByIdHandler)
  .delete(deleteARamHandler)
  .patch(validateSchemaMiddleware(updateRamJoiSchema), updateRamByIdHandler);

export { ramRouter };
