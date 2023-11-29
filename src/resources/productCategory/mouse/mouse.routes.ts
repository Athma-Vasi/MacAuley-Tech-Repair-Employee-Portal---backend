import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
import {
	createNewMouseBulkHandler,
	createNewMouseHandler,
	deleteAMouseHandler,
	deleteAllMiceHandler,
	getMouseByIdHandler,
	getQueriedMiceHandler,
	updateMouseByIdHandler,
	updateMiceBulkHandler,
} from "./mouse.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const mouseRouter = Router();

mouseRouter.use(verifyRoles());

mouseRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedMiceHandler,
	)
	.post(createNewMouseHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
mouseRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllMiceHandler);

// DEV ROUTE
mouseRouter
	.route("/dev")
	.post(createNewMouseBulkHandler)
	.patch(updateMiceBulkHandler);

// single document routes
mouseRouter
	.route("/:mouseId")
	.get(verifyJWTMiddleware, verifyRoles(), getMouseByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAMouseHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateMouseByIdHandler);

export { mouseRouter };
