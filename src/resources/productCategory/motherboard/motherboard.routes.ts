import { Router } from "express";
import {
  createNewMotherboardBulkHandler,
  createNewMotherboardHandler,
  deleteAMotherboardHandler,
  deleteAllMotherboardsHandler,
  getMotherboardByIdHandler,
  getQueriedMotherboardsHandler,
  updateMotherboardByIdHandler,
  updateMotherboardsBulkHandler,
} from "./motherboard.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createMotherboardJoiSchema,
  updateMotherboardJoiSchema,
} from "./motherboard.validation";

const motherboardRouter = Router();

motherboardRouter
  .route("/")
  .get(getQueriedMotherboardsHandler)
  .post(
    validateSchemaMiddleware(createMotherboardJoiSchema, "motherboardSchema"),
    createNewMotherboardHandler
  );

// separate route for safety reasons (as it deletes all documents in the collection)
motherboardRouter.route("/delete-all").delete(deleteAllMotherboardsHandler);

// DEV ROUTE
motherboardRouter
  .route("/dev")
  .post(createNewMotherboardBulkHandler)
  .patch(updateMotherboardsBulkHandler);

// single document routes
motherboardRouter
  .route("/:motherboardId")
  .get(getMotherboardByIdHandler)
  .delete(deleteAMotherboardHandler)
  .patch(
    validateSchemaMiddleware(updateMotherboardJoiSchema),
    updateMotherboardByIdHandler
  );

export { motherboardRouter };
