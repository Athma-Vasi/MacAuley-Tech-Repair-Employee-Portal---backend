import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
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

microphoneRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedMicrophonesHandler,
	)
	.post(createNewMicrophoneHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
microphoneRouter.route("/delete-all").delete(deleteAllMicrophonesHandler);

// DEV ROUTE
microphoneRouter
	.route("/dev")
	.post(createNewMicrophoneBulkHandler)
	.patch(updateMicrophonesBulkHandler);

// single document routes
microphoneRouter
	.route("/:microphoneId")
	.get(getMicrophoneByIdHandler)
	.delete(deleteAMicrophoneHandler)
	.patch(updateMicrophoneByIdHandler);

export { microphoneRouter };
