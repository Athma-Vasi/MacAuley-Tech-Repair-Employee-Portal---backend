import { Router } from "express";
import {
  createNewRequestResourceHandler,
  getQueriedRequestResourcesHandler,
  getRequestResourcesByUserHandler,
  getRequestResourceByIdHandler,
  deleteRequestResourceHandler,
  deleteAllRequestResourcesHandler,
  updateRequestResourceByIdHandler,
  createNewRequestResourcesBulkHandler,
  updateRequestResourcesBulkHandler,
} from "./requestResource.controller";

const requestResourceRouter = Router();

requestResourceRouter
  .route("/")
  .get(getQueriedRequestResourcesHandler)
  .post(createNewRequestResourceHandler);

requestResourceRouter.route("/delete-all").delete(deleteAllRequestResourcesHandler);

requestResourceRouter.route("/user").get(getRequestResourcesByUserHandler);

// DEV ROUTES
requestResourceRouter
  .route("/dev")
  .post(createNewRequestResourcesBulkHandler)
  .patch(updateRequestResourcesBulkHandler);

requestResourceRouter
  .route("/:requestResourceId")
  .get(getRequestResourceByIdHandler)
  .delete(deleteRequestResourceHandler)
  .patch(updateRequestResourceByIdHandler);

export { requestResourceRouter };
