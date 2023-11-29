import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
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

webcamRouter.use(verifyRoles());

webcamRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedWebcamsHandler,
	)
	.post(createNewWebcamHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
webcamRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllWebcamsHandler);

// DEV ROUTE
webcamRouter
	.route("/dev")
	.post(createNewWebcamBulkHandler)
	.patch(updateWebcamsBulkHandler);

// single document routes
webcamRouter
	.route("/:webcamId")
	.get(verifyJWTMiddleware, verifyRoles(), getWebcamByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAWebcamHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateWebcamByIdHandler);

export { webcamRouter };
