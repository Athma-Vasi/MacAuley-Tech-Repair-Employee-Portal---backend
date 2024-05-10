import { Router, NextFunction } from "express";
import {
  createNewHeadphoneBulkController,
  createNewHeadphoneController,
  deleteAHeadphoneController,
  deleteAllHeadphonesController,
  getHeadphoneByIdController,
  getQueriedHeadphonesController,
  updateHeadphoneByIdController,
  updateHeadphonesBulkController,
} from "./headphone.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createHeadphoneJoiSchema,
  updateHeadphoneJoiSchema,
} from "./headphone.validation";

const headphoneRouter = Router();

headphoneRouter
  .route("/")
  .get(getQueriedHeadphonesController)
  .post(
    validateSchemaMiddleware(createHeadphoneJoiSchema, "headphoneSchema"),
    createNewHeadphoneController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
headphoneRouter.route("/delete-all").delete(deleteAllHeadphonesController);

// DEV ROUTE
headphoneRouter
  .route("/dev")
  .post(createNewHeadphoneBulkController)
  .patch(updateHeadphonesBulkController);

// single document routes
headphoneRouter
  .route("/:headphoneId")
  .get(getHeadphoneByIdController)
  .delete(deleteAHeadphoneController)
  .patch(
    validateSchemaMiddleware(updateHeadphoneJoiSchema),
    updateHeadphoneByIdController
  );

export { headphoneRouter };
