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

const storageRouter = Router();

storageRouter.route("/").get(getQueriedStoragesHandler).post(createNewStorageHandler);

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
  .patch(updateStorageByIdHandler);

export { storageRouter };
