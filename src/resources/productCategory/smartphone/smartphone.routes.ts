import { Router } from "express";
import {
  createNewSmartphoneBulkController,
  createNewSmartphoneController,
  deleteASmartphoneController,
  deleteAllSmartphonesController,
  getSmartphoneByIdController,
  getQueriedSmartphonesController,
  updateSmartphoneByIdController,
  updateSmartphonesBulkController,
} from "./smartphone.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createSmartphoneJoiSchema,
  updateSmartphoneJoiSchema,
} from "./smartphone.validation";

const smartphoneRouter = Router();

smartphoneRouter
  .route("/")
  .get(getQueriedSmartphonesController)
  .post(
    validateSchemaMiddleware(createSmartphoneJoiSchema, "smartphoneSchema"),
    createNewSmartphoneController
  );

// separate route for safety reasons (as it deletes all documents in the collection)
smartphoneRouter.route("/delete-all").delete(deleteAllSmartphonesController);

// DEV ROUTE
smartphoneRouter
  .route("/dev")
  .post(createNewSmartphoneBulkController)
  .patch(
    validateSchemaMiddleware(updateSmartphoneJoiSchema),
    updateSmartphonesBulkController
  );

// single document routes
smartphoneRouter
  .route("/:smartphoneId")
  .get(getSmartphoneByIdController)
  .delete(deleteASmartphoneController)
  .patch(updateSmartphoneByIdController);

export { smartphoneRouter };
