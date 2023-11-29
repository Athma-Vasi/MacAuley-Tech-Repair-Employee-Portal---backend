import { Router } from "express";
import { assignQueryDefaults, verifyRoles } from "../../../middlewares";
import {
	createNewPsuBulkHandler,
	createNewPsuHandler,
	deleteAPsuHandler,
	deleteAllPsusHandler,
	getPsuByIdHandler,
	getQueriedPsusHandler,
	returnAllFileUploadsForPsusHandler,
	updatePsuByIdHandler,
} from "./psu.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const psuRouter = Router();

psuRouter.use(verifyRoles());

psuRouter
	.route("/")
	.get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedPsusHandler)
	.post(createNewPsuHandler)
	.delete(deleteAllPsusHandler);

// DEV ROUTE
psuRouter.route("/dev").post(createNewPsuBulkHandler);

psuRouter.route("/fileUploads").post(returnAllFileUploadsForPsusHandler);

psuRouter
	.route("/:psuId")
	.get(getPsuByIdHandler)
	.delete(deleteAPsuHandler)
	.put(updatePsuByIdHandler);

export { psuRouter };
