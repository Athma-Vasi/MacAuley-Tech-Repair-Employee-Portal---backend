import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
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

psuRouter
	.route("/")
	.get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedPsusHandler)
	.post(createNewPsuHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
psuRouter.route("/delete-all").delete(deleteAllPsusHandler);

// DEV ROUTE
psuRouter
	.route("/dev")
	.post(createNewPsuBulkHandler)
	.patch(updatePsusBulkHandler);

// single document routes
psuRouter
	.route("/:psuId")
	.get(getPsuByIdHandler)
	.delete(deleteAPsuHandler)
	.patch(updatePsuByIdHandler);

export { psuRouter };
