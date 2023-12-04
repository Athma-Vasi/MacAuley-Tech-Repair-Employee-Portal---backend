import { Router } from "express";
import {
  createNewRequestResourceHandler,
  getQueriedRequestResourcesHandler,
  getRequestResourcesByUserHandler,
  getRequestResourceByIdHandler,
  deleteRequestResourceHandler,
  deleteAllRequestResourcesHandler,
  updateRequestResourceStatusByIdHandler,
  createNewRequestResourcesBulkHandler,
  updateRequestResourcesBulkHandler,
} from "./requestResource.controller";
import { assignQueryDefaults } from "../../../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../../constants";

const requestResourceRouter = Router();

requestResourceRouter
  .route("/")
  .get(
    assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
    getQueriedRequestResourcesHandler
  )
  .post(createNewRequestResourceHandler);

requestResourceRouter.route("/delete-all").delete(deleteAllRequestResourcesHandler);

requestResourceRouter
  .route("/user")
  .get(
    assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
    getRequestResourcesByUserHandler
  );

// DEV ROUTES
requestResourceRouter
  .route("/dev")
  .post(createNewRequestResourcesBulkHandler)
  .patch(updateRequestResourcesBulkHandler);

requestResourceRouter
  .route("/:requestResourceId")
  .get(getRequestResourceByIdHandler)
  .delete(deleteRequestResourceHandler)
  .patch(updateRequestResourceStatusByIdHandler);

export { requestResourceRouter };
