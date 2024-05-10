import { Router, NextFunction } from "express";
import {
  createNewWebcamBulkController,
  createNewWebcamController,
  deleteAWebcamController,
  deleteAllWebcamsController,
  getWebcamByIdController,
  getQueriedWebcamsController,
  updateWebcamByIdController,
  updateWebcamsBulkController,
} from "./webcam.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createWebcamJoiSchema, updateWebcamJoiSchema } from "./webcam.validation";

const webcamRouter = Router();

webcamRouter
  .route("/")
  .get(getQueriedWebcamsController)
  .post(
    validateSchemaMiddleware(createWebcamJoiSchema, "webcamSchema"),
    createNewWebcamController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
webcamRouter.route("/delete-all").delete(deleteAllWebcamsController);

// DEV ROUTE
webcamRouter
  .route("/dev")
  .post(createNewWebcamBulkController)
  .patch(updateWebcamsBulkController);

// single document routes
webcamRouter
  .route("/:webcamId")
  .get(getWebcamByIdController)
  .delete(deleteAWebcamController)
  .patch(validateSchemaMiddleware(updateWebcamJoiSchema), updateWebcamByIdController);

export { webcamRouter };
