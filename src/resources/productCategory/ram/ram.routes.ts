import { Router, NextFunction } from "express";
import {
  createNewRamBulkController,
  createNewRamController,
  deleteARamController,
  deleteAllRamsController,
  getRamByIdController,
  getQueriedRamsController,
  updateRamByIdController,
  updateRamsBulkController,
} from "./ram.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createRamJoiSchema, updateRamJoiSchema } from "./ram.validation";

const ramRouter = Router();

ramRouter
  .route("/")
  .get(getQueriedRamsController)
  .post(
    validateSchemaMiddleware(createRamJoiSchema, "ramSchema"),
    createNewRamController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
ramRouter.route("/delete-all").delete(deleteAllRamsController);

// DEV ROUTE
ramRouter.route("/dev").post(createNewRamBulkController).patch(updateRamsBulkController);

// single document routes
ramRouter
  .route("/:ramId")
  .get(getRamByIdController)
  .delete(deleteARamController)
  .patch(validateSchemaMiddleware(updateRamJoiSchema), updateRamByIdController);

export { ramRouter };
