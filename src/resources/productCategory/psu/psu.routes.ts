import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
import {
	createNewPsuBulkHandler,
	createNewPsuHandler,
	deleteAPsuHandler,
	deleteAllPsusHandler,
	getPsuByIdHandler,
	getQueriedPsusHandler,
	updatePsuByIdHandler,
	updatePsusBulkHandler,
} from "./psu.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const psuRouter = Router();

psuRouter.use(verifyRoles());

psuRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedPsusHandler,
	)
	.post(createNewPsuHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
psuRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllPsusHandler);

// DEV ROUTE
psuRouter
	.route("/dev")
	.post(createNewPsuBulkHandler)
	.patch(updatePsusBulkHandler);

// single document routes
psuRouter
	.route("/:psuId")
	.get(verifyJWTMiddleware, verifyRoles(), getPsuByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAPsuHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updatePsuByIdHandler);

export { psuRouter };
