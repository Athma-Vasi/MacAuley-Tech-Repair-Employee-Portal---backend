import { Router } from "express";
import {
  createNewAddressChangeHandler,
  getQueriedAddressChangesHandler,
  getAddressChangesByUserHandler,
  getAddressChangeByIdHandler,
  deleteAnAddressChangeHandler,
  deleteAllAddressChangesHandler,
  updateAddressChangeByIdHandler,
  createNewAddressChangesBulkHandler,
  updateAddressChangesBulkHandler,
} from "./addressChange.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createAddressChangeJoiSchema,
  updateAddressChangeJoiSchema,
} from "./addressChange.validation";

const addressChangeRouter = Router();

addressChangeRouter
  .route("/")
  .get(getQueriedAddressChangesHandler)
  .post(
    validateSchemaMiddleware(createAddressChangeJoiSchema, "addressChangeSchema"),
    createNewAddressChangeHandler
  );

addressChangeRouter.route("/delete-all").delete(deleteAllAddressChangesHandler);

addressChangeRouter.route("/user").get(getAddressChangesByUserHandler);

// DEV ROUTES
addressChangeRouter
  .route("/dev")
  .post(createNewAddressChangesBulkHandler)
  .patch(updateAddressChangesBulkHandler);

addressChangeRouter
  .route("/:addressChangeId")
  .get(getAddressChangeByIdHandler)
  .delete(deleteAnAddressChangeHandler)
  .patch(
    validateSchemaMiddleware(updateAddressChangeJoiSchema),
    updateAddressChangeByIdHandler
  );

export { addressChangeRouter };
