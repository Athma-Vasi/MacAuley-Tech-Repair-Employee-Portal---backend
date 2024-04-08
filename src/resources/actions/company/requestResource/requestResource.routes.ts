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
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createRequestResourceJoiSchema,
  updateRequestResourceJoiSchema,
} from "./requestResource.validation";

const requestResourceRouter = Router();

requestResourceRouter
  .route("/")
  .get(getQueriedRequestResourcesHandler)
  .post(
    validateSchemaMiddleware(createRequestResourceJoiSchema, "requestResourceSchema"),
    createNewRequestResourceHandler
  );

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
  .patch(
    validateSchemaMiddleware(updateRequestResourceJoiSchema),
    updateRequestResourceByIdHandler
  );

export { requestResourceRouter };
