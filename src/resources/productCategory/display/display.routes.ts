import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
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

displayRouter.use(verifyRoles());

displayRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedDisplaysHandler,
	)
	.post(createNewDisplayHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
displayRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllDisplaysHandler);

// DEV ROUTE
displayRouter
	.route("/dev")
	.post(createNewDisplayBulkHandler)
	.patch(updateDisplaysBulkHandler);

// single document routes
displayRouter
	.route("/:displayId")
	.get(verifyJWTMiddleware, verifyRoles(), getDisplayByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteADisplayHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateDisplayByIdHandler);

export { displayRouter };
