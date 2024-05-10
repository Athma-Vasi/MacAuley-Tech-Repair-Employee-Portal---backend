import { Router } from "express";
import {
  createNewRequestResourceController,
  getQueriedRequestResourcesController,
  getRequestResourcesByUserController,
  getRequestResourceByIdController,
  deleteRequestResourceController,
  deleteAllRequestResourcesController,
  updateRequestResourceByIdController,
  createNewRequestResourcesBulkController,
  updateRequestResourcesBulkController,
} from "./requestResource.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createRequestResourceJoiSchema,
  updateRequestResourceJoiSchema,
} from "./requestResource.validation";

const requestResourceRouter = Router();

requestResourceRouter
  .route("/")
  .get(getQueriedRequestResourcesController)
  .post(
    validateSchemaMiddleware(createRequestResourceJoiSchema, "requestResourceSchema"),
    createNewRequestResourceController
  );

requestResourceRouter.route("/delete-all").delete(deleteAllRequestResourcesController);

requestResourceRouter.route("/user").get(getRequestResourcesByUserController);

// DEV ROUTES
requestResourceRouter
  .route("/dev")
  .post(createNewRequestResourcesBulkController)
  .patch(updateRequestResourcesBulkController);

requestResourceRouter
  .route("/:requestResourceId")
  .get(getRequestResourceByIdController)
  .delete(deleteRequestResourceController)
  .patch(
    validateSchemaMiddleware(updateRequestResourceJoiSchema),
    updateRequestResourceByIdController
  );

export { requestResourceRouter };
