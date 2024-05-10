import { Router } from "express";
import {
  createNewLeaveRequestController,
  getQueriedLeaveRequestsController,
  getLeaveRequestsByUserController,
  getLeaveRequestByIdController,
  deleteLeaveRequestController,
  deleteAllLeaveRequestsController,
  updateLeaveRequestByIdController,
  createNewLeaveRequestsBulkController,
  updateLeaveRequestsBulkController,
} from "./leaveRequest.controller";
import { validateSchemaMiddleware } from "../../../../middlewares/validateSchema";
import {
  createLeaveRequestJoiSchema,
  updateLeaveRequestJoiSchema,
} from "./leaveRequest.validation";

const leaveRequestRouter = Router();

leaveRequestRouter
  .route("/")
  .get(getQueriedLeaveRequestsController)
  .post(
    validateSchemaMiddleware(createLeaveRequestJoiSchema, "leaveRequestSchema"),
    createNewLeaveRequestController
  );

leaveRequestRouter.route("/delete-all").delete(deleteAllLeaveRequestsController);

leaveRequestRouter.route("/user").get(getLeaveRequestsByUserController);

// DEV ROUTES
leaveRequestRouter
  .route("/dev")
  .post(createNewLeaveRequestsBulkController)
  .patch(updateLeaveRequestsBulkController);

leaveRequestRouter
  .route("/:leaveRequestId")
  .get(getLeaveRequestByIdController)
  .delete(deleteLeaveRequestController)
  .patch(
    validateSchemaMiddleware(updateLeaveRequestJoiSchema),
    updateLeaveRequestByIdController
  );

export { leaveRequestRouter };
