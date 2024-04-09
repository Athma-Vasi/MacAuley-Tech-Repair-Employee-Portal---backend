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
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createSmartphoneJoiSchema,
  updateSmartphoneJoiSchema,
} from "./smartphone.validation";

const smartphoneRouter = Router();

smartphoneRouter
  .route("/")
  .get(getQueriedSmartphonesHandler)
  .post(
    validateSchemaMiddleware(createSmartphoneJoiSchema, "smartphoneSchema"),
    createNewSmartphoneHandler
  );

// separate route for safety reasons (as it deletes all documents in the collection)
smartphoneRouter.route("/delete-all").delete(deleteAllSmartphonesHandler);

// DEV ROUTE
smartphoneRouter
  .route("/dev")
  .post(createNewSmartphoneBulkHandler)
  .patch(
    validateSchemaMiddleware(updateSmartphoneJoiSchema),
    updateSmartphonesBulkHandler
  );

// single document routes
smartphoneRouter
  .route("/:smartphoneId")
  .get(getSmartphoneByIdHandler)
  .delete(deleteASmartphoneHandler)
  .patch(updateSmartphoneByIdHandler);

export { smartphoneRouter };
