import { Router } from "express";
import { assignQueryDefaults } from "../../../middlewares";
import {
	createNewSpeakerBulkHandler,
	createNewSpeakerHandler,
	deleteASpeakerHandler,
	deleteAllSpeakersHandler,
	getSpeakerByIdHandler,
	getQueriedSpeakersHandler,
	updateSpeakerByIdHandler,
	updateSpeakersBulkHandler,
} from "./speaker.controller";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../constants";

const speakerRouter = Router();

speakerRouter
	.route("/")
	.get(
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedSpeakersHandler,
	)
	.post(createNewSpeakerHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
speakerRouter.route("/delete-all").delete(deleteAllSpeakersHandler);

// DEV ROUTE
speakerRouter
	.route("/dev")
	.post(createNewSpeakerBulkHandler)
	.patch(updateSpeakersBulkHandler);

// single document routes
speakerRouter
	.route("/:speakerId")
	.get(getSpeakerByIdHandler)
	.delete(deleteASpeakerHandler)
	.patch(updateSpeakerByIdHandler);

export { speakerRouter };
