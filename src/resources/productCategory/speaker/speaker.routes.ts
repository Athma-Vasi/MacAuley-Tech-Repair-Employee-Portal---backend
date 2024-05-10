import { Router } from "express";
import {
  createNewSpeakerBulkController,
  createNewSpeakerController,
  deleteASpeakerController,
  deleteAllSpeakersController,
  getSpeakerByIdController,
  getQueriedSpeakersController,
  updateSpeakerByIdController,
  updateSpeakersBulkController,
} from "./speaker.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createSpeakerJoiSchema, updateSpeakerJoiSchema } from "./speaker.validation";

const speakerRouter = Router();

speakerRouter
  .route("/")
  .get(getQueriedSpeakersController)
  .post(
    validateSchemaMiddleware(createSpeakerJoiSchema, "speakerSchema"),
    createNewSpeakerController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
speakerRouter.route("/delete-all").delete(deleteAllSpeakersController);

// DEV ROUTE
speakerRouter
  .route("/dev")
  .post(createNewSpeakerBulkController)
  .patch(updateSpeakersBulkController);

// single document routes
speakerRouter
  .route("/:speakerId")
  .get(getSpeakerByIdController)
  .delete(deleteASpeakerController)
  .patch(validateSchemaMiddleware(updateSpeakerJoiSchema), updateSpeakerByIdController);

export { speakerRouter };
