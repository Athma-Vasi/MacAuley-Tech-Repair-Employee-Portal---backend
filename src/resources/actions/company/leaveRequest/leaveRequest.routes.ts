import { Router } from "express";
import {
  createNewLeaveRequestHandler,
  getQueriedLeaveRequestsHandler,
  getLeaveRequestsByUserHandler,
  getLeaveRequestByIdHandler,
  deleteLeaveRequestHandler,
  deleteAllLeaveRequestsHandler,
  updateLeaveRequestByIdHandler,
  createNewLeaveRequestsBulkHandler,
  updateLeaveRequestsBulkHandler,
} from "./leaveRequest.controller";

const leaveRequestRouter = Router();

leaveRequestRouter
  .route("/")
  .get(getQueriedLeaveRequestsHandler)
  .post(createNewLeaveRequestHandler);

leaveRequestRouter.route("/delete-all").delete(deleteAllLeaveRequestsHandler);

leaveRequestRouter.route("/user").get(getLeaveRequestsByUserHandler);

// DEV ROUTES
leaveRequestRouter
  .route("/dev")
  .post(createNewLeaveRequestsBulkHandler)
  .patch(updateLeaveRequestsBulkHandler);

leaveRequestRouter
  .route("/:leaveRequestId")
  .get(getLeaveRequestByIdHandler)
  .delete(deleteLeaveRequestHandler)
  .patch(updateLeaveRequestByIdHandler);

export { leaveRequestRouter };
