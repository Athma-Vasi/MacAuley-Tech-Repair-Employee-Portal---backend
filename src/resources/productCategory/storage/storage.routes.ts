import { Router } from "express";
import {
  createNewStorageBulkHandler,
  createNewStorageHandler,
  deleteAStorageHandler,
  deleteAllStoragesHandler,
  getStorageByIdHandler,
  getQueriedStoragesHandler,
  updateStorageByIdHandler,
  updateStoragesBulkHandler,
} from "./storage.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createStorageJoiSchema, updateStorageJoiSchema } from "./storage.validation";

const storageRouter = Router();

storageRouter
  .route("/")
  .get(getQueriedStoragesHandler)
  .post(
    validateSchemaMiddleware(createStorageJoiSchema, "storageSchema"),
    createNewStorageHandler
  );

// separate route for safety reasons (as it deletes all documents in the collection)
storageRouter.route("/delete-all").delete(deleteAllStoragesHandler);

// DEV ROUTE
storageRouter
  .route("/dev")
  .post(createNewStorageBulkHandler)
  .patch(updateStoragesBulkHandler);

// single document routes
storageRouter
  .route("/:storageId")
  .get(getStorageByIdHandler)
  .delete(deleteAStorageHandler)
  .patch(validateSchemaMiddleware(updateStorageJoiSchema), updateStorageByIdHandler);

export { storageRouter };
