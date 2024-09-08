import { Router } from "express";
import { validateSchemaMiddleware } from "../../../middlewares/validateSchema";
import {
  createLeaveRequestJoiSchema,
  updateLeaveRequestJoiSchema,
} from "./leaveRequest.validation";
import {
  createNewResourceHandler,
  deleteManyResourcesHandler,
  deleteResourceByIdHandler,
  getQueriedResourcesByUserHandler,
  getQueriedResourcesHandler,
  getResourceByIdHandler,
  updateResourceByIdHandler,
} from "../../../handlers";
import { LeaveRequestModel } from "./leaveRequest.model";

const leaveRequestRouter = Router();

leaveRequestRouter
  .route("/")
  // @desc   Get all leave requests
  // @route  GET api/v1/company/leave-request
  // @access Private/Admin/Manager
  .get(getQueriedResourcesHandler(LeaveRequestModel))
  // @desc   Create a new leave request
  // @route  POST api/v1/company/leave-request
  // @access Private
  .post(
    validateSchemaMiddleware(createLeaveRequestJoiSchema, "schema"),
    createNewResourceHandler(LeaveRequestModel),
  );

// @desc   Delete many leave requests
// @route  DELETE api/v1/company/leave-request/delete-many
// @access Private/Admin/Manager
leaveRequestRouter.route("/delete-many").delete(
  deleteManyResourcesHandler(LeaveRequestModel),
);

// @desc   Get all leave requests by user
// @route  GET api/v1/company/leave-request/user
// @access Private/Admin/Manager
leaveRequestRouter.route("/user").get(
  getQueriedResourcesByUserHandler(LeaveRequestModel),
);

leaveRequestRouter
  .route("/:resourceId")
  // @desc   Get a leave request by ID
  // @route  GET api/v1/company/leave-request/:resourceId
  // @access Private/Admin/Manager
  .get(getResourceByIdHandler(LeaveRequestModel))
  // @desc   Delete a leave request by ID
  // @route  DELETE api/v1/company/leave-request/:resourceId
  // @access Private/Admin/Manager
  .delete(deleteResourceByIdHandler(LeaveRequestModel))
  // @desc   Update a leave request by ID
  // @route  PATCH api/v1/company/leave-request/:resourceId
  // @access Private/Admin/Manager
  .patch(
    validateSchemaMiddleware(updateLeaveRequestJoiSchema),
    updateResourceByIdHandler(LeaveRequestModel),
  );

export { leaveRequestRouter };
