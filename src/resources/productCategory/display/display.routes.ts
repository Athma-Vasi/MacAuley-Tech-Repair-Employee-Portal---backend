import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
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
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const displayRouter = Router();

displayRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedDisplaysHandler,
	)
	.post(createNewDisplayHandler);

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
	.patch(updateDisplayByIdHandler);

export { displayRouter };
