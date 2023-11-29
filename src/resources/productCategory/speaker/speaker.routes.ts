import { Router } from "express";
import {
	assignQueryDefaults,
	verifyJWTMiddleware,
	verifyRoles,
} from "../../../middlewares";
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

speakerRouter.use(verifyRoles());

speakerRouter
	.route("/")
	.get(
		verifyJWTMiddleware,
		verifyRoles(),
		assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
		getQueriedSpeakersHandler,
	)
	.post(createNewSpeakerHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
speakerRouter
	.route("/delete-all")
	.delete(verifyJWTMiddleware, verifyRoles(), deleteAllSpeakersHandler);

// DEV ROUTE
speakerRouter
	.route("/dev")
	.post(createNewSpeakerBulkHandler)
	.patch(updateSpeakersBulkHandler);

// single document routes
speakerRouter
	.route("/:speakerId")
	.get(verifyJWTMiddleware, verifyRoles(), getSpeakerByIdHandler)
	.delete(verifyJWTMiddleware, verifyRoles(), deleteASpeakerHandler)
	.patch(verifyJWTMiddleware, verifyRoles(), updateSpeakerByIdHandler);

export { speakerRouter };
