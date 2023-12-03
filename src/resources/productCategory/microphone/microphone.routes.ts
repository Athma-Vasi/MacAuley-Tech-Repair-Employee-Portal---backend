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

const microphoneRouter = Router();

microphoneRouter
  .route("/")
  .get(getQueriedMicrophonesHandler)
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
