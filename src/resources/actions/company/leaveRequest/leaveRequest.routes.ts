import { Router } from "express";
import {
  createNewLeaveRequestHandler,
  getQueriedLeaveRequestsHandler,
  getLeaveRequestsByUserHandler,
  getLeaveRequestByIdHandler,
  deleteLeaveRequestHandler,
  deleteAllLeaveRequestsHandler,
  updateLeaveRequestStatusByIdHandler,
  createNewLeaveRequestsBulkHandler,
  updateLeaveRequestsBulkHandler,
} from "./leaveRequest.controller";
import { assignQueryDefaults } from "../../../../middlewares";
import { FIND_QUERY_OPTIONS_KEYWORDS } from "../../../../constants";

const leaveRequestRouter = Router();

leaveRequestRouter
  .route("/")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedLeaveRequestsHandler)
  .post(createNewLeaveRequestHandler);

leaveRequestRouter.route("/delete-all").delete(deleteAllLeaveRequestsHandler);

leaveRequestRouter
  .route("/user")
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getLeaveRequestsByUserHandler);

// DEV ROUTES
leaveRequestRouter
  .route("/dev")
  .post(createNewLeaveRequestsBulkHandler)
  .patch(updateLeaveRequestsBulkHandler);

leaveRequestRouter
  .route("/:leaveRequestId")
  .get(getLeaveRequestByIdHandler)
  .delete(deleteLeaveRequestHandler)
  .patch(updateLeaveRequestStatusByIdHandler);

export { leaveRequestRouter };
