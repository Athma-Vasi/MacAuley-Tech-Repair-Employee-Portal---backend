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

const endorsementRouter = Router();

endorsementRouter
  .route("/")
  .get(getQueriedEndorsementsHandler)
  .post(createNewEndorsementHandler);

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
  .patch(updateEndorsementByIdHandler);

export { endorsementRouter };
