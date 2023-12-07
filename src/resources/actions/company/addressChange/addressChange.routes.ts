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

const addressChangeRouter = Router();

addressChangeRouter
  .route("/")
  .get(getQueriedAddressChangesHandler)
  .post(createNewAddressChangeHandler);

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
  .patch(updateAddressChangeByIdHandler);

export { addressChangeRouter };
