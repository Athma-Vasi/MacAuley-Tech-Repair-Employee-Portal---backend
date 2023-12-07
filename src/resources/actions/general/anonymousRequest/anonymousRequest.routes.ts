import { Router } from "express";
import {
  createNewAnonymousRequestHandler,
  getQueriedAnonymousRequestsHandler,
  getAnonymousRequestsByUserHandler,
  getAnonymousRequestByIdHandler,
  deleteAnonymousRequestHandler,
  deleteAllAnonymousRequestsHandler,
  updateAnonymousRequestByIdHandler,
  createNewAnonymousRequestsBulkHandler,
  updateAnonymousRequestsBulkHandler,
} from "./anonymousRequest.controller";

const anonymousRequestRouter = Router();

anonymousRequestRouter
  .route("/")
  .get(getQueriedAnonymousRequestsHandler)
  .post(createNewAnonymousRequestHandler);

anonymousRequestRouter.route("/delete-all").delete(deleteAllAnonymousRequestsHandler);

anonymousRequestRouter.route("/user").get(getAnonymousRequestsByUserHandler);

// DEV ROUTES
anonymousRequestRouter
  .route("/dev")
  .post(createNewAnonymousRequestsBulkHandler)
  .patch(updateAnonymousRequestsBulkHandler);

anonymousRequestRouter
  .route("/:anonymousRequestId")
  .get(getAnonymousRequestByIdHandler)
  .delete(deleteAnonymousRequestHandler)
  .patch(updateAnonymousRequestByIdHandler);

export { anonymousRequestRouter };
