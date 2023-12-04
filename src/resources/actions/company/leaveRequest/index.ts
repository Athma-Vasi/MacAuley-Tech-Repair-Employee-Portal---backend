/**
 * This barrel file is used to import/export leaveRequest model, router, types, handlers and services
 */

/**
 * Imports
 */
import { LeaveRequestModel } from "./leaveRequest.model";
import { leaveRequestRouter } from "./leaveRequest.routes";
import {
  createNewLeaveRequestHandler,
  createNewLeaveRequestsBulkHandler,
  deleteAllLeaveRequestsHandler,
  deleteLeaveRequestHandler,
  getLeaveRequestByIdHandler,
  getLeaveRequestsByUserHandler,
  getQueriedLeaveRequestsHandler,
  updateLeaveRequestStatusByIdHandler,
  updateLeaveRequestsBulkHandler,
} from "./leaveRequest.controller";
import {
  createNewLeaveRequestService,
  deleteAllLeaveRequestsService,
  deleteLeaveRequestByIdService,
  getLeaveRequestByIdService,
  getQueriedLeaveRequestsByUserService,
  getQueriedLeaveRequestsService,
  getQueriedTotalLeaveRequestsService,
  updateLeaveRequestByIdService,
} from "./leaveRequest.service";

import type {
  LeaveRequestDocument,
  LeaveRequestSchema,
  ReasonForLeave,
} from "./leaveRequest.model";
import type {
  CreateNewLeaveRequestRequest,
  CreateNewLeaveRequestsBulkRequest,
  DeleteAllLeaveRequestsRequest,
  DeleteLeaveRequestRequest,
  GetLeaveRequestByIdRequest,
  GetQueriedLeaveRequestsByUserRequest,
  GetQueriedLeaveRequestsRequest,
  UpdateLeaveRequestByIdRequest,
  UpdateLeaveRequestsBulkRequest,
} from "./leaveRequest.types";

/**
 * Exports
 */

export {
  LeaveRequestModel,
  leaveRequestRouter,
  createNewLeaveRequestHandler,
  createNewLeaveRequestsBulkHandler,
  deleteAllLeaveRequestsHandler,
  deleteLeaveRequestHandler,
  getLeaveRequestByIdHandler,
  getLeaveRequestsByUserHandler,
  getQueriedLeaveRequestsHandler,
  updateLeaveRequestStatusByIdHandler,
  updateLeaveRequestsBulkHandler,
  createNewLeaveRequestService,
  deleteAllLeaveRequestsService,
  deleteLeaveRequestByIdService,
  getLeaveRequestByIdService,
  getQueriedLeaveRequestsByUserService,
  getQueriedLeaveRequestsService,
  getQueriedTotalLeaveRequestsService,
  updateLeaveRequestByIdService,
};

export type {
  LeaveRequestDocument,
  LeaveRequestSchema,
  ReasonForLeave,
  CreateNewLeaveRequestRequest,
  CreateNewLeaveRequestsBulkRequest,
  DeleteAllLeaveRequestsRequest,
  DeleteLeaveRequestRequest,
  GetLeaveRequestByIdRequest,
  GetQueriedLeaveRequestsByUserRequest,
  GetQueriedLeaveRequestsRequest,
  UpdateLeaveRequestByIdRequest,
  UpdateLeaveRequestsBulkRequest,
};
