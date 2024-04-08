import { Router } from "express";
import {
  createNewEndorsementHandler,
  getQueriedEndorsementsHandler,
  getEndorsementsByUserHandler,
  getEndorsementByIdHandler,
  deleteEndorsementHandler,
  deleteAllEndorsementsHandler,
  updateEndorsementByIdHandler,
  createNewEndorsementsBulkHandler,
  updateEndorsementsBulkHandler,
} from "./endorsement.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createEndorsementJoiSchema,
  updateEndorsementJoiSchema,
} from "./endorsement.validation";

const endorsementRouter = Router();

endorsementRouter
  .route("/")
  .get(getQueriedEndorsementsHandler)
  .post(
    validateSchemaMiddleware(createEndorsementJoiSchema, "endorsementSchema"),
    createNewEndorsementHandler
  );

endorsementRouter.route("/delete-all").delete(deleteAllEndorsementsHandler);

endorsementRouter.route("/user").get(getEndorsementsByUserHandler);

// DEV ROUTES
endorsementRouter
  .route("/dev")
  .post(createNewEndorsementsBulkHandler)
  .patch(updateEndorsementsBulkHandler);

endorsementRouter
  .route("/:endorsementId")
  .get(getEndorsementByIdHandler)
  .delete(deleteEndorsementHandler)
  .patch(
    validateSchemaMiddleware(updateEndorsementJoiSchema, "documentUpdate"),
    updateEndorsementByIdHandler
  );

export { endorsementRouter };
