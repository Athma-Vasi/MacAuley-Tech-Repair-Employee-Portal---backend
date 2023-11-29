import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
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

motherboardRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedMotherboardsHandler,
	)
	.post(createNewMotherboardHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
motherboardRouter.route("/delete-all").delete(deleteAllMotherboardsHandler);

// DEV ROUTE
motherboardRouter
	.route("/dev")
	.post(createNewMotherboardBulkHandler)
	.patch(updateMotherboardsBulkHandler);

// single document routes
motherboardRouter
	.route("/:motherboardId")
	.get(getMotherboardByIdHandler)
	.delete(deleteAMotherboardHandler)
	.patch(updateMotherboardByIdHandler);

export { motherboardRouter };
