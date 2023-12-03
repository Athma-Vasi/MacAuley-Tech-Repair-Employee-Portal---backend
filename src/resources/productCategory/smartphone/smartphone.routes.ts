import { Router } from "express";
import {
  createNewSmartphoneBulkHandler,
  createNewSmartphoneHandler,
  deleteASmartphoneHandler,
  deleteAllSmartphonesHandler,
  getSmartphoneByIdHandler,
  getQueriedSmartphonesHandler,
  updateSmartphoneByIdHandler,
  updateSmartphonesBulkHandler,
} from "./smartphone.controller";

const smartphoneRouter = Router();

smartphoneRouter
  .route("/")
  .get(getQueriedSmartphonesHandler)
  .post(createNewSmartphoneHandler);

// separate route for safety reasons (as it deletes all documents in the collection)
smartphoneRouter.route("/delete-all").delete(deleteAllSmartphonesHandler);

// DEV ROUTE
smartphoneRouter
  .route("/dev")
  .post(createNewSmartphoneBulkHandler)
  .patch(updateSmartphonesBulkHandler);

// single document routes
smartphoneRouter
  .route("/:smartphoneId")
  .get(getSmartphoneByIdHandler)
  .delete(deleteASmartphoneHandler)
  .patch(updateSmartphoneByIdHandler);

export { smartphoneRouter };
