import { Router } from "express";
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

const speakerRouter = Router();

speakerRouter.route("/").get(getQueriedSpeakersHandler).post(createNewSpeakerHandler);

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
