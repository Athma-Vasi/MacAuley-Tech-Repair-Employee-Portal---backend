import { Router, NextFunction } from "express";
import {
  createNewMotherboardBulkController,
  createNewMotherboardController,
  deleteAMotherboardController,
  deleteAllMotherboardsController,
  getMotherboardByIdController,
  getQueriedMotherboardsController,
  updateMotherboardByIdController,
  updateMotherboardsBulkController,
} from "./motherboard.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createMotherboardJoiSchema,
  updateMotherboardJoiSchema,
} from "./motherboard.validation";

const motherboardRouter = Router();

motherboardRouter
  .route("/")
  .get(getQueriedMotherboardsController)
  .post(
    validateSchemaMiddleware(createMotherboardJoiSchema, "motherboardSchema"),
    createNewMotherboardController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
motherboardRouter.route("/delete-all").delete(deleteAllMotherboardsController);

// DEV ROUTE
motherboardRouter
  .route("/dev")
  .post(createNewMotherboardBulkController)
  .patch(updateMotherboardsBulkController);

// single document routes
motherboardRouter
  .route("/:motherboardId")
  .get(getMotherboardByIdController)
  .delete(deleteAMotherboardController)
  .patch(
    validateSchemaMiddleware(updateMotherboardJoiSchema),
    updateMotherboardByIdController
  );

export { motherboardRouter };
