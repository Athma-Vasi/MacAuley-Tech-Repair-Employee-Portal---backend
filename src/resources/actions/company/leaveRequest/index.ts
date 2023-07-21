/**
 * This barrel file is used to import/export leaveRequest model, router, types, handlers and services
 */

/**
 * Imports
 */
import { LeaveRequestModel } from './leaveRequest.model';
import { leaveRequestRouter } from './leaveRequest.routes';
import {
  createNewLeaveRequestHandler,
  deleteALeaveRequestHandler,
  deleteAllLeaveRequestsHandler,
  getQueriedLeaveRequestsHandler,
  getLeaveRequestByIdHandler,
  getLeaveRequestsByUserHandler,
} from './leaveRequest.controller';
import {
  createNewLeaveRequestService,
  getLeaveRequestByIdService,
  deleteALeaveRequestService,
  deleteAllLeaveRequestsService,
  getQueriedLeaveRequestsService,
  getLeaveRequestsByUserService,
} from './leaveRequest.service';

import type {
  LeaveRequestDocument,
  LeaveRequestSchema,
  ReasonForLeave,
} from './leaveRequest.model';
import type {
  CreateNewLeaveRequestRequest,
  DeleteALeaveRequestRequest,
  DeleteAllLeaveRequestsRequest,
  GetLeaveRequestByIdRequest,
  GetLeaveRequestsByUserRequest,
  LeaveRequestServerResponse,
} from './leaveRequest.types';

/**
 * Exports
 */

export {
  LeaveRequestModel,
  leaveRequestRouter,
  createNewLeaveRequestHandler,
  deleteALeaveRequestHandler,
  deleteAllLeaveRequestsHandler,
  getQueriedLeaveRequestsHandler,
  getLeaveRequestByIdHandler,
  getLeaveRequestsByUserHandler,
  createNewLeaveRequestService,
  getLeaveRequestByIdService,
  deleteALeaveRequestService,
  deleteAllLeaveRequestsService,
  getQueriedLeaveRequestsService,
  getLeaveRequestsByUserService,
};

export type {
  LeaveRequestDocument,
  LeaveRequestSchema,
  ReasonForLeave,
  CreateNewLeaveRequestRequest,
  DeleteALeaveRequestRequest,
  DeleteAllLeaveRequestsRequest,
  GetLeaveRequestByIdRequest,
  GetLeaveRequestsByUserRequest,
  LeaveRequestServerResponse,
};
