import { Router } from "express";
import {
  createNewAnonymousRequestHandler,
  getQueriedAnonymousRequestsHandler,
  getAnonymousRequestsByUserHandler,
  getAnonymousRequestByIdHandler,
  deleteAnonymousRequestHandler,
  deleteAllAnonymousRequestsHandler,
  updateAnonymousRequestStatusByIdHandler,
  createNewAnonymousRequestsBulkHandler,
  updateAnonymousRequestsBulkHandler,
} from "./anonymousRequest.controller";
import { assignQueryDefaults } from "../../../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../../constants";

const anonymousRequestRouter = Router();

anonymousRequestRouter
  .route("/")
  .get(
    assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
    getQueriedAnonymousRequestsHandler
  )
  .post(createNewAnonymousRequestHandler);

anonymousRequestRouter.route("/delete-all").delete(deleteAllAnonymousRequestsHandler);

anonymousRequestRouter
  .route("/user")
  .get(
    assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
    getAnonymousRequestsByUserHandler
  );

// DEV ROUTES
anonymousRequestRouter
  .route("/dev")
  .post(createNewAnonymousRequestsBulkHandler)
  .patch(updateAnonymousRequestsBulkHandler);

anonymousRequestRouter
  .route("/:anonymousRequestId")
  .get(getAnonymousRequestByIdHandler)
  .delete(deleteAnonymousRequestHandler)
  .patch(updateAnonymousRequestStatusByIdHandler);

export { anonymousRequestRouter };
