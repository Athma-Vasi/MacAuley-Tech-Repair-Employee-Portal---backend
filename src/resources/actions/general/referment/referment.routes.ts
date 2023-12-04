import { Router } from "express";
import {
  createNewRefermentHandler,
  getQueriedRefermentsHandler,
  getRefermentsByUserHandler,
  getRefermentByIdHandler,
  deleteRefermentHandler,
  deleteAllRefermentsHandler,
  updateRefermentStatusByIdHandler,
  createNewRefermentsBulkHandler,
  updateRefermentsBulkHandler,
} from "./referment.controller";
import { assignQueryDefaults } from "../../../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../../constants";

const refermentRouter = Router();

refermentRouter
  .route("/")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedRefermentsHandler)
  .post(createNewRefermentHandler);

refermentRouter.route("/delete-all").delete(deleteAllRefermentsHandler);

refermentRouter
  .route("/user")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getRefermentsByUserHandler);

// DEV ROUTES
refermentRouter
  .route("/dev")
  .post(createNewRefermentsBulkHandler)
  .patch(updateRefermentsBulkHandler);

refermentRouter
  .route("/:refermentId")
  .get(getRefermentByIdHandler)
  .delete(deleteRefermentHandler)
  .patch(updateRefermentStatusByIdHandler);

export { refermentRouter };
