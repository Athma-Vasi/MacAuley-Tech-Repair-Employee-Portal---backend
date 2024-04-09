import { Router } from "express";
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
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createMicrophoneJoiSchema,
  updateMicrophoneJoiSchema,
} from "./microphone.validation";

const microphoneRouter = Router();

microphoneRouter
  .route("/")
  .get(getQueriedMicrophonesHandler)
  .post(
    validateSchemaMiddleware(createMicrophoneJoiSchema, "microphoneSchema"),
    createNewMicrophoneHandler
  );

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
  .patch(
    validateSchemaMiddleware(updateMicrophoneJoiSchema),
    updateMicrophoneByIdHandler
  );

export { microphoneRouter };
