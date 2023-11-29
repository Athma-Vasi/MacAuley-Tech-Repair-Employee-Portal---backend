import { Router } from "express";
import { assignQueryDefaults, verifyRoles } from "../../../middlewares";
import {
	createNewRamBulkHandler,
	createNewRamHandler,
	deleteARamHandler,
	deleteAllRamsHandler,
	getRamByIdHandler,
	getQueriedRamsHandler,
	returnAllFileUploadsForRamsHandler,
	updateRamByIdHandler,
} from "./ram.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const ramRouter = Router();

ramRouter.use(verifyRoles());

ramRouter
	.route("/")
	.get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedRamsHandler)
	.post(createNewRamHandler)
	.delete(deleteAllRamsHandler);

// DEV ROUTE
ramRouter.route("/dev").post(createNewRamBulkHandler);

ramRouter.route("/fileUploads").post(returnAllFileUploadsForRamsHandler);

ramRouter
	.route("/:ramId")
	.get(getRamByIdHandler)
	.delete(deleteARamHandler)
	.put(updateRamByIdHandler);

export { ramRouter };
