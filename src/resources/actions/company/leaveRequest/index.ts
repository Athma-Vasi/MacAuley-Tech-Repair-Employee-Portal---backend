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
  getQueriedLeaveRequestsByUserHandler,
} from './leaveRequest.controller';
import {
  createNewLeaveRequestService,
  getLeaveRequestByIdService,
  deleteALeaveRequestService,
  deleteAllLeaveRequestsService,
  getQueriedLeaveRequestsService,
  getQueriedLeaveRequestsByUserService,
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
  getQueriedLeaveRequestsByUserHandler,
  createNewLeaveRequestService,
  getLeaveRequestByIdService,
  deleteALeaveRequestService,
  deleteAllLeaveRequestsService,
  getQueriedLeaveRequestsService,
  getQueriedLeaveRequestsByUserService,
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
};
