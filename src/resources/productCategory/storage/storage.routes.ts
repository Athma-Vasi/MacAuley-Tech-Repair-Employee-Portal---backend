import { Router, NextFunction } from "express";
import {
  createNewStorageBulkController,
  createNewStorageController,
  deleteAStorageController,
  deleteAllStoragesController,
  getStorageByIdController,
  getQueriedStoragesController,
  updateStorageByIdController,
  updateStoragesBulkController,
} from "./storage.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createStorageJoiSchema, updateStorageJoiSchema } from "./storage.validation";

const storageRouter = Router();

storageRouter
  .route("/")
  .get(getQueriedStoragesController)
  .post(
    validateSchemaMiddleware(createStorageJoiSchema, "storageSchema"),
    createNewStorageController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
storageRouter.route("/delete-all").delete(deleteAllStoragesController);

// DEV ROUTE
storageRouter
  .route("/dev")
  .post(createNewStorageBulkController)
  .patch(updateStoragesBulkController);

// single document routes
storageRouter
  .route("/:storageId")
  .get(getStorageByIdController)
  .delete(deleteAStorageController)
  .patch(validateSchemaMiddleware(updateStorageJoiSchema), updateStorageByIdController);

export { storageRouter };
