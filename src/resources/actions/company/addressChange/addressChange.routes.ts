import { Router } from "express";
import {
  createNewAddressChangeController,
  getQueriedAddressChangesController,
  getAddressChangesByUserController,
  getAddressChangeByIdController,
  deleteAnAddressChangeController,
  deleteAllAddressChangesController,
  updateAddressChangeByIdController,
  createNewAddressChangesBulkController,
  updateAddressChangesBulkController,
} from "./addressChange.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createAddressChangeJoiSchema,
  updateAddressChangeJoiSchema,
} from "./addressChange.validation";

const addressChangeRouter = Router();

addressChangeRouter
  .route("/")
  .get(getQueriedAddressChangesController)
  .post(
    validateSchemaMiddleware(createAddressChangeJoiSchema, "addressChangeSchema"),
    createNewAddressChangeController
  );

addressChangeRouter.route("/delete-all").delete(deleteAllAddressChangesController);

addressChangeRouter.route("/user").get(getAddressChangesByUserController);

// DEV ROUTES
addressChangeRouter
  .route("/dev")
  .post(createNewAddressChangesBulkController)
  .patch(updateAddressChangesBulkController);

addressChangeRouter
  .route("/:addressChangeId")
  .get(getAddressChangeByIdController)
  .delete(deleteAnAddressChangeController)
  .patch(
    validateSchemaMiddleware(updateAddressChangeJoiSchema),
    updateAddressChangeByIdController
  );

export { addressChangeRouter };
