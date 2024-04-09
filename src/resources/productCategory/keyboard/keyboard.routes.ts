import { Router } from "express";
import {
  createNewKeyboardBulkHandler,
  createNewKeyboardHandler,
  deleteAKeyboardHandler,
  deleteAllKeyboardsHandler,
  getKeyboardByIdHandler,
  getQueriedKeyboardsHandler,
  updateKeyboardByIdHandler,
  updateKeyboardsBulkHandler,
} from "./keyboard.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createKeyboardJoiSchema, updateKeyboardJoiSchema } from "./keyboard.validation";

const keyboardRouter = Router();

keyboardRouter
  .route("/")
  .get(getQueriedKeyboardsHandler)
  .post(
    validateSchemaMiddleware(createKeyboardJoiSchema, "keyboardSchema"),
    createNewKeyboardHandler
  );

// separate route for safety reasons (as it deletes all documents in the collection)
keyboardRouter.route("/delete-all").delete(deleteAllKeyboardsHandler);

// DEV ROUTE
keyboardRouter
  .route("/dev")
  .post(createNewKeyboardBulkHandler)
  .patch(updateKeyboardsBulkHandler);

// single document routes
keyboardRouter
  .route("/:keyboardId")
  .get(getKeyboardByIdHandler)
  .delete(deleteAKeyboardHandler)
  .patch(validateSchemaMiddleware(updateKeyboardJoiSchema), updateKeyboardByIdHandler);

export { keyboardRouter };
