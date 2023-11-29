import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
import {
	createNewMotherboardBulkHandler,
	createNewMotherboardHandler,
	deleteAMotherboardHandler,
	deleteAllMotherboardsHandler,
	getMotherboardByIdHandler,
	getQueriedMotherboardsHandler,
	updateMotherboardByIdHandler,
	updateMotherboardsBulkHandler,
} from "./motherboard.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const motherboardRouter = Router();

motherboardRouter.use(verifyRoles());

motherboardRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedMotherboardsHandler,
	)
	.post(createNewMotherboardHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
motherboardRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllMotherboardsHandler);

// DEV ROUTE
motherboardRouter
	.route("/dev")
	.post(createNewMotherboardBulkHandler)
	.patch(updateMotherboardsBulkHandler);

// single document routes
motherboardRouter
	.route("/:motherboardId")
	.get(verifyJWTMiddleware, verifyRoles(), getMotherboardByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAMotherboardHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateMotherboardByIdHandler);

export { motherboardRouter };
