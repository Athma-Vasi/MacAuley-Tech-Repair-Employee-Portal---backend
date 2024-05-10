import { Router } from "express";
import {
  createNewAnonymousRequestController,
  getQueriedAnonymousRequestsController,
  getAnonymousRequestsByUserController,
  getAnonymousRequestByIdController,
  deleteAnonymousRequestController,
  deleteAllAnonymousRequestsController,
  updateAnonymousRequestByIdController,
  createNewAnonymousRequestsBulkController,
  updateAnonymousRequestsBulkController,
} from "./anonymousRequest.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createAnonymousRequestJoiSchema,
  updateAnonymousRequestJoiSchema,
} from "./anonymousRequest.validation";

const anonymousRequestRouter = Router();

anonymousRequestRouter
  .route("/")
  .get(getQueriedAnonymousRequestsController)
  .post(
    validateSchemaMiddleware(createAnonymousRequestJoiSchema, "anonymousRequestSchema"),
    createNewAnonymousRequestController
  );

anonymousRequestRouter.route("/delete-all").delete(deleteAllAnonymousRequestsController);

anonymousRequestRouter.route("/user").get(getAnonymousRequestsByUserController);

// DEV ROUTES
anonymousRequestRouter
  .route("/dev")
  .post(createNewAnonymousRequestsBulkController)
  .patch(updateAnonymousRequestsBulkController);

anonymousRequestRouter
  .route("/:anonymousRequestId")
  .get(getAnonymousRequestByIdController)
  .delete(deleteAnonymousRequestController)
  .patch(
    validateSchemaMiddleware(updateAnonymousRequestJoiSchema),
    updateAnonymousRequestByIdController
  );

export { anonymousRequestRouter };
