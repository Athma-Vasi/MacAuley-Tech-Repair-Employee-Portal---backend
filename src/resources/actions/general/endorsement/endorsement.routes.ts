import { Router } from "express";
import {
  createNewEndorsementHandler,
  getQueriedEndorsementsHandler,
  getEndorsementsByUserHandler,
  getEndorsementByIdHandler,
  deleteEndorsementHandler,
  deleteAllEndorsementsHandler,
  updateEndorsementStatusByIdHandler,
  createNewEndorsementsBulkHandler,
  updateEndorsementsBulkHandler,
} from "./endorsement.controller";
import { assignQueryDefaults } from "../../../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../../constants";

const endorsementRouter = Router();

endorsementRouter
  .route("/")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedEndorsementsHandler)
  .post(createNewEndorsementHandler);

endorsementRouter.route("/delete-all").delete(deleteAllEndorsementsHandler);

endorsementRouter
  .route("/user")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getEndorsementsByUserHandler);

// DEV ROUTES
endorsementRouter
  .route("/dev")
  .post(createNewEndorsementsBulkHandler)
  .patch(updateEndorsementsBulkHandler);

endorsementRouter
  .route("/:endorsementId")
  .get(getEndorsementByIdHandler)
  .delete(deleteEndorsementHandler)
  .patch(updateEndorsementStatusByIdHandler);

export { endorsementRouter };
