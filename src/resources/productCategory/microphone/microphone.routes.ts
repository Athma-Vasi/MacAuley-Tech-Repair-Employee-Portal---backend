import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
import {
	createNewMicrophoneBulkHandler,
	createNewMicrophoneHandler,
	deleteAMicrophoneHandler,
	deleteAllMicrophonesHandler,
	getMicrophoneByIdHandler,
	getQueriedMicrophonesHandler,
	updateMicrophoneByIdHandler,
	updateMicrophonesBulkHandler,
} from "./microphone.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const microphoneRouter = Router();

microphoneRouter.use(verifyRoles());

microphoneRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedMicrophonesHandler,
	)
	.post(createNewMicrophoneHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
microphoneRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllMicrophonesHandler);

// DEV ROUTE
microphoneRouter
	.route("/dev")
	.post(createNewMicrophoneBulkHandler)
	.patch(updateMicrophonesBulkHandler);

// single document routes
microphoneRouter
	.route("/:microphoneId")
	.get(verifyJWTMiddleware, verifyRoles(), getMicrophoneByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAMicrophoneHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateMicrophoneByIdHandler);

export { microphoneRouter };
