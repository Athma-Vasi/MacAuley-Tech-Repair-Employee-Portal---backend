import { Router } from "express";
import {
  createNewAddressChangeHandler,
  getQueriedAddressChangesHandler,
  getAddressChangesByUserHandler,
  getAddressChangeByIdHandler,
  deleteAnAddressChangeHandler,
  deleteAllAddressChangesHandler,
  updateAddressChangeStatusByIdHandler,
  createNewAddressChangesBulkHandler,
  updateAddressChangesBulkHandler,
} from "./addressChange.controller";
import { assignQueryDefaults } from "../../../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../../constants";

const addressChangeRouter = Router();

addressChangeRouter
  .route("/")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedAddressChangesHandler)
  .post(createNewAddressChangeHandler);

addressChangeRouter.route("/delete-all").delete(deleteAllAddressChangesHandler);

addressChangeRouter
  .route("/user")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getAddressChangesByUserHandler);

// DEV ROUTES
addressChangeRouter
  .route("/dev")
  .post(createNewAddressChangesBulkHandler)
  .patch(updateAddressChangesBulkHandler);

addressChangeRouter
  .route("/:addressChangeId")
  .get(getAddressChangeByIdHandler)
  .delete(deleteAnAddressChangeHandler)
  .patch(updateAddressChangeStatusByIdHandler);

export { addressChangeRouter };
