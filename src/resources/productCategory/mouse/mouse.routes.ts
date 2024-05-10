import { Router, NextFunction } from "express";
import {
  createNewMouseBulkController,
  createNewMouseController,
  deleteAMouseController,
  deleteAllMiceController,
  getMouseByIdController,
  getQueriedMiceController,
  updateMouseByIdController,
  updateMiceBulkController,
} from "./mouse.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createMouseJoiSchema, updateMouseJoiSchema } from "./mouse.validation";

const mouseRouter = Router();

mouseRouter
  .route("/")
  .get(getQueriedMiceController)
  .post(
    validateSchemaMiddleware(createMouseJoiSchema, "mouseSchema"),
    createNewMouseController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
mouseRouter.route("/delete-all").delete(deleteAllMiceController);

// DEV ROUTE
mouseRouter
  .route("/dev")
  .post(createNewMouseBulkController)
  .patch(updateMiceBulkController);

// single document routes
mouseRouter
  .route("/:mouseId")
  .get(getMouseByIdController)
  .delete(deleteAMouseController)
  .patch(validateSchemaMiddleware(updateMouseJoiSchema), updateMouseByIdController);

export { mouseRouter };
