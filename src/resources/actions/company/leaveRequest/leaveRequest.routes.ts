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
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createLeaveRequestJoiSchema,
  updateLeaveRequestJoiSchema,
} from "./leaveRequest.validation";

const leaveRequestRouter = Router();

leaveRequestRouter
  .route("/")
  .get(getQueriedLeaveRequestsHandler)
  .post(
    validateSchemaMiddleware(createLeaveRequestJoiSchema, "leaveRequestSchema"),
    createNewLeaveRequestHandler
  );

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
  .patch(
    validateSchemaMiddleware(updateLeaveRequestJoiSchema),
    updateLeaveRequestByIdHandler
  );

export { leaveRequestRouter };
