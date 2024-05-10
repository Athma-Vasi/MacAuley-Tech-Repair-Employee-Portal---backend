import { Router } from "express";
import {
  createNewMicrophoneBulkController,
  createNewMicrophoneController,
  deleteAMicrophoneController,
  deleteAllMicrophonesController,
  getMicrophoneByIdController,
  getQueriedMicrophonesController,
  updateMicrophoneByIdController,
  updateMicrophonesBulkController,
} from "./microphone.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createMicrophoneJoiSchema,
  updateMicrophoneJoiSchema,
} from "./microphone.validation";

const microphoneRouter = Router();

microphoneRouter
  .route("/")
  .get(getQueriedMicrophonesController)
  .post(
    validateSchemaMiddleware(createMicrophoneJoiSchema, "microphoneSchema"),
    createNewMicrophoneController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
microphoneRouter.route("/delete-all").delete(deleteAllMicrophonesController);

// DEV ROUTE
microphoneRouter
  .route("/dev")
  .post(createNewMicrophoneBulkController)
  .patch(updateMicrophonesBulkController);

// single document routes
microphoneRouter
  .route("/:microphoneId")
  .get(getMicrophoneByIdController)
  .delete(deleteAMicrophoneController)
  .patch(
    validateSchemaMiddleware(updateMicrophoneJoiSchema),
    updateMicrophoneByIdController
  );

export { microphoneRouter };
