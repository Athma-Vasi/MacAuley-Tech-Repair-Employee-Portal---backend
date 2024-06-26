import { Router } from "express";

import {
  createNewAccessoryBulkController,
  createNewAccessoryController,
  deleteAAccessoryController,
  deleteAllAccessoriesController,
  getAccessoryByIdController,
  getQueriedAccessoriesController,
  updateAccessoriesBulkController,
  updateAccessoryByIdController,
} from "./accessory.controller";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import { createAccessoryJoiSchema } from "./accessory.validation";

const accessoryRouter = Router();

accessoryRouter
  .route("/")
  .post(createNewAccessoryController)
  .get(getQueriedAccessoriesController);

// separate route for safety reasons (as it deletes all documents in the collection)
accessoryRouter.route("/delete-all").delete(deleteAllAccessoriesController);

// DEV ROUTE
accessoryRouter
  .route("/dev")
  .post(createNewAccessoryBulkController)
  .patch(
    validateSchemaMiddleware(createAccessoryJoiSchema, "accessorySchema"),
    updateAccessoriesBulkController
  );

accessoryRouter
  .route("/:accessoryId")
  .get(getAccessoryByIdController)
  .delete(deleteAAccessoryController)
  .patch(updateAccessoryByIdController);

export { accessoryRouter };
