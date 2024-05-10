import { Router } from "express";
import {
  createNewEndorsementController,
  getQueriedEndorsementsController,
  getEndorsementsByUserController,
  getEndorsementByIdController,
  deleteEndorsementController,
  deleteAllEndorsementsController,
  updateEndorsementByIdController,
  createNewEndorsementsBulkController,
  updateEndorsementsBulkController,
} from "./endorsement.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createEndorsementJoiSchema,
  updateEndorsementJoiSchema,
} from "./endorsement.validation";

const endorsementRouter = Router();

endorsementRouter
  .route("/")
  .get(getQueriedEndorsementsController)
  .post(
    validateSchemaMiddleware(createEndorsementJoiSchema, "endorsementSchema"),
    createNewEndorsementController
  );

endorsementRouter.route("/delete-all").delete(deleteAllEndorsementsController);

endorsementRouter.route("/user").get(getEndorsementsByUserController);

// DEV ROUTES
endorsementRouter
  .route("/dev")
  .post(createNewEndorsementsBulkController)
  .patch(updateEndorsementsBulkController);

endorsementRouter
  .route("/:endorsementId")
  .get(getEndorsementByIdController)
  .delete(deleteEndorsementController)
  .patch(
    validateSchemaMiddleware(updateEndorsementJoiSchema, "documentUpdate"),
    updateEndorsementByIdController
  );

export { endorsementRouter };
