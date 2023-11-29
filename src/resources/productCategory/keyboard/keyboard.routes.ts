import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
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
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const keyboardRouter = Router();

keyboardRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedKeyboardsHandler,
	)
	.post(createNewKeyboardHandler);

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
