import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
import {
	createNewWebcamBulkHandler,
	createNewWebcamHandler,
	deleteAWebcamHandler,
	deleteAllWebcamsHandler,
	getWebcamByIdHandler,
	getQueriedWebcamsHandler,
	updateWebcamByIdHandler,
	updateWebcamsBulkHandler,
} from "./webcam.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const webcamRouter = Router();

webcamRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedWebcamsHandler,
	)
	.post(createNewWebcamHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
webcamRouter.route("/delete-all").delete(deleteAllWebcamsHandler);

// DEV ROUTE
webcamRouter
	.route("/dev")
	.post(createNewWebcamBulkHandler)
	.patch(updateWebcamsBulkHandler);

// single document routes
webcamRouter
	.route("/:webcamId")
	.get(getWebcamByIdHandler)
	.delete(deleteAWebcamHandler)
	.patch(updateWebcamByIdHandler);

export { webcamRouter };
