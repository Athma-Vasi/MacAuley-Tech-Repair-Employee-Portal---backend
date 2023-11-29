import { Router } from "express";
import { assignQueryDefaults, verifyRoles } from "../../../middlewares";
import {
	createNewMotherboardBulkHandler,
	createNewMotherboardHandler,
	deleteAMotherboardHandler,
	deleteAllMotherboardsHandler,
	getMotherboardByIdHandler,
	getQueriedMotherboardsHandler,
	returnAllFileUploadsForMotherboardsHandler,
	updateMotherboardByIdHandler,
} from "./motherboard.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const motherboardRouter = Router();

motherboardRouter.use(verifyRoles());

motherboardRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedMotherboardsHandler,
	)
	.post(createNewMotherboardHandler)
	.delete(deleteAllMotherboardsHandler);

// DEV ROUTE
motherboardRouter.route("/dev").post(createNewMotherboardBulkHandler);

motherboardRouter
	.route("/fileUploads")
	.post(returnAllFileUploadsForMotherboardsHandler);

motherboardRouter
	.route("/:motherboardId")
	.get(getMotherboardByIdHandler)
	.delete(deleteAMotherboardHandler)
	.put(updateMotherboardByIdHandler);

export { motherboardRouter };
