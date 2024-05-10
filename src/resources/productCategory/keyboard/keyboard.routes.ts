import { Router, NextFunction } from "express";
import {
  createNewKeyboardBulkController,
  createNewKeyboardController,
  deleteAKeyboardController,
  deleteAllKeyboardsController,
  getKeyboardByIdController,
  getQueriedKeyboardsController,
  updateKeyboardByIdController,
  updateKeyboardsBulkController,
} from "./keyboard.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createKeyboardJoiSchema, updateKeyboardJoiSchema } from "./keyboard.validation";

const keyboardRouter = Router();

keyboardRouter
  .route("/")
  .get(getQueriedKeyboardsController)
  .post(
    validateSchemaMiddleware(createKeyboardJoiSchema, "keyboardSchema"),
    createNewKeyboardController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
keyboardRouter.route("/delete-all").delete(deleteAllKeyboardsController);

// DEV ROUTE
keyboardRouter
  .route("/dev")
  .post(createNewKeyboardBulkController)
  .patch(updateKeyboardsBulkController);

// single document routes
keyboardRouter
  .route("/:keyboardId")
  .get(getKeyboardByIdController)
  .delete(deleteAKeyboardController)
  .patch(validateSchemaMiddleware(updateKeyboardJoiSchema), updateKeyboardByIdController);

export { keyboardRouter };
