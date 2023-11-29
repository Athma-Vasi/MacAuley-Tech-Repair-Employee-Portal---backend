import { Router } from "express";
import { assignQueryDefaults, verifyRoles } from "../../../middlewares";
import {
	createNewKeyboardBulkHandler,
	createNewKeyboardHandler,
	deleteAKeyboardHandler,
	deleteAllKeyboardsHandler,
	getKeyboardByIdHandler,
	getQueriedKeyboardsHandler,
	returnAllFileUploadsForKeyboardsHandler,
	updateKeyboardByIdHandler,
} from "./keyboard.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const keyboardRouter = Router();

keyboardRouter.use(verifyRoles());

keyboardRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedKeyboardsHandler,
	)
	.post(createNewKeyboardHandler)
	.delete(deleteAllKeyboardsHandler);

// DEV ROUTE
keyboardRouter.route("/dev").post(createNewKeyboardBulkHandler);

keyboardRouter
	.route("/fileUploads")
	.post(returnAllFileUploadsForKeyboardsHandler);

keyboardRouter
	.route("/:keyboardId")
	.get(getKeyboardByIdHandler)
	.delete(deleteAKeyboardHandler)
	.put(updateKeyboardByIdHandler);

export { keyboardRouter };
