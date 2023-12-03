import { Router } from "express";
import {
  createNewWebcamBulkHandler,
  createNewWebcamHandler,
  deleteAWebcamHandler,
  deleteAllWebcamsHandler,
  getWebcamByIdHandler,
  getQueriedWebcamsHandler,
  updateWebcamByIdHandler,
  updateWebcamsBulkHandler,
} from "./webcam.controller";

const webcamRouter = Router();

webcamRouter.route("/").get(getQueriedWebcamsHandler).post(createNewWebcamHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
webcamRouter.route("/delete-all").delete(deleteAllWebcamsHandler);

// DEV ROUTE
webcamRouter
  .route("/dev")
  .post(createNewWebcamBulkHandler)
  .patch(updateWebcamsBulkHandler);

// single document routes
webcamRouter
  .route("/:webcamId")
  .get(getWebcamByIdHandler)
  .delete(deleteAWebcamHandler)
  .patch(updateWebcamByIdHandler);

export { webcamRouter };
