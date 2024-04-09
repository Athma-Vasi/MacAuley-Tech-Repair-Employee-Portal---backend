import { Router } from "express";
import {
  createNewDisplayBulkHandler,
  createNewDisplayHandler,
  deleteADisplayHandler,
  deleteAllDisplaysHandler,
  getDisplayByIdHandler,
  getQueriedDisplaysHandler,
  updateDisplayByIdHandler,
  updateDisplaysBulkHandler,
} from "./display.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createDisplayJoiSchema, updateDisplayJoiSchema } from "./display.validation";

const displayRouter = Router();

displayRouter
  .route("/")
  .get(getQueriedDisplaysHandler)
  .post(
    validateSchemaMiddleware(createDisplayJoiSchema, "displaySchema"),
    createNewDisplayHandler
  );

// separate route for safety reasons (as it deletes all documents in the collection)
displayRouter.route("/delete-all").delete(deleteAllDisplaysHandler);

// DEV ROUTE
displayRouter
  .route("/dev")
  .post(createNewDisplayBulkHandler)
  .patch(updateDisplaysBulkHandler);

// single document routes
displayRouter
  .route("/:displayId")
  .get(getDisplayByIdHandler)
  .delete(deleteADisplayHandler)
  .patch(validateSchemaMiddleware(updateDisplayJoiSchema), updateDisplayByIdHandler);

export { displayRouter };
