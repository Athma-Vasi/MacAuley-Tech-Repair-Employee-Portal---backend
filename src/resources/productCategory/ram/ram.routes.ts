import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
import {
	createNewRamBulkHandler,
	createNewRamHandler,
	deleteARamHandler,
	deleteAllRamsHandler,
	getRamByIdHandler,
	getQueriedRamsHandler,
	updateRamByIdHandler,
	updateRamsBulkHandler,
} from "./ram.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const ramRouter = Router();

ramRouter.use(verifyRoles());

ramRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedRamsHandler,
	)
	.post(createNewRamHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
ramRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllRamsHandler);

// DEV ROUTE
ramRouter
	.route("/dev")
	.post(createNewRamBulkHandler)
	.patch(updateRamsBulkHandler);

// single document routes
ramRouter
	.route("/:ramId")
	.get(verifyJWTMiddleware, verifyRoles(), getRamByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteARamHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateRamByIdHandler);

export { ramRouter };
