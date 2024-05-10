import { Router } from "express";
import {
  createNewDisplayBulkController,
  createNewDisplayController,
  deleteADisplayController,
  deleteAllDisplaysController,
  getDisplayByIdController,
  getQueriedDisplaysController,
  updateDisplayByIdController,
  updateDisplaysBulkController,
} from "./display.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createDisplayJoiSchema, updateDisplayJoiSchema } from "./display.validation";

const displayRouter = Router();

displayRouter
  .route("/")
  .get(getQueriedDisplaysController)
  .post(
    validateSchemaMiddleware(createDisplayJoiSchema, "displaySchema"),
    createNewDisplayController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
displayRouter.route("/delete-all").delete(deleteAllDisplaysController);

// DEV ROUTE
displayRouter
  .route("/dev")
  .post(createNewDisplayBulkController)
  .patch(updateDisplaysBulkController);

// single document routes
displayRouter
  .route("/:displayId")
  .get(getDisplayByIdController)
  .delete(deleteADisplayController)
  .patch(validateSchemaMiddleware(updateDisplayJoiSchema), updateDisplayByIdController);

export { displayRouter };
