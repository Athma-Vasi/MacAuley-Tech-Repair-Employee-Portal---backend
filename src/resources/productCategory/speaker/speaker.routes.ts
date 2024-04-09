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
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createSpeakerJoiSchema, updateSpeakerJoiSchema } from "./speaker.validation";

const speakerRouter = Router();

speakerRouter
  .route("/")
  .get(getQueriedSpeakersHandler)
  .post(
    validateSchemaMiddleware(createSpeakerJoiSchema, "speakerSchema"),
    createNewSpeakerHandler
  );

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
  .patch(validateSchemaMiddleware(updateSpeakerJoiSchema), updateSpeakerByIdHandler);

export { speakerRouter };
