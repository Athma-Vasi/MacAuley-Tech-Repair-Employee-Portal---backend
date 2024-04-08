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
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createAnonymousRequestJoiSchema,
  updateAnonymousRequestJoiSchema,
} from "./anonymousRequest.validation";

const anonymousRequestRouter = Router();

anonymousRequestRouter
  .route("/")
  .get(getQueriedAnonymousRequestsHandler)
  .post(
    validateSchemaMiddleware(createAnonymousRequestJoiSchema, "anonymousRequestSchema"),
    createNewAnonymousRequestHandler
  );

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
  .patch(
    validateSchemaMiddleware(updateAnonymousRequestJoiSchema),
    updateAnonymousRequestByIdHandler
  );

export { anonymousRequestRouter };
