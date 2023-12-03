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

const keyboardRouter = Router();

keyboardRouter.route("/").get(getQueriedKeyboardsHandler).post(createNewKeyboardHandler);

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
  .patch(updateKeyboardByIdHandler);

export { keyboardRouter };
