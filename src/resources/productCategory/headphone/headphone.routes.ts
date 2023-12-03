import { Router } from "express";
import {
  createNewHeadphoneBulkHandler,
  createNewHeadphoneHandler,
  deleteAHeadphoneHandler,
  deleteAllHeadphonesHandler,
  getHeadphoneByIdHandler,
  getQueriedHeadphonesHandler,
  updateHeadphoneByIdHandler,
  updateHeadphonesBulkHandler,
} from "./headphone.controller";

const headphoneRouter = Router();

headphoneRouter
  .route("/")
  .get(getQueriedHeadphonesHandler)
  .post(createNewHeadphoneHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
headphoneRouter.route("/delete-all").delete(deleteAllHeadphonesHandler);

// DEV ROUTE
headphoneRouter
  .route("/dev")
  .post(createNewHeadphoneBulkHandler)
  .patch(updateHeadphonesBulkHandler);

// single document routes
headphoneRouter
  .route("/:headphoneId")
  .get(getHeadphoneByIdHandler)
  .delete(deleteAHeadphoneHandler)
  .patch(updateHeadphoneByIdHandler);

export { headphoneRouter };
