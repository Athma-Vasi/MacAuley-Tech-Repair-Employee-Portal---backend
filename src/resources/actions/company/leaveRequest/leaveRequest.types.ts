import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { ReasonForLeave } from './leaveRequest.model';
import { UserRoles } from '../../../user';
import { GetQueriedResourceRequest, RequestStatus } from '../../../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewLeaveRequestRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    leaveRequest: {
      startDate: Date;
      endDate: Date;
      reasonForLeave: ReasonForLeave;
      delegatedToEmployee: string;
      delegatedResponsibilities: string;
      additionalComments: string;
      acknowledgement: boolean;
    };
  };
}

// DEV ROUTE
interface CreateNewLeaveRequestBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    leaveRequests: {
      userId: Types.ObjectId;
      username: string;
      startDate: Date;
      endDate: Date;
      reasonForLeave: ReasonForLeave;
      delegatedToEmployee: string;
      delegatedResponsibilities: string;
      additionalComments: string;
      acknowledgement: boolean;
      requestStatus: RequestStatus;
    }[];
  };
}

interface DeleteALeaveRequestRequest extends RequestAfterJWTVerification {
  params: {
    leaveRequestId: string;
  };
}

type DeleteAllLeaveRequestsRequest = RequestAfterJWTVerification;

type GetQueriedLeaveRequestsByUserRequest = GetQueriedResourceRequest;

type GetQueriedLeaveRequestsRequest = GetQueriedResourceRequest;

interface GetLeaveRequestByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { leaveRequestId: string };
}

interface UpdateLeaveRequestStatusByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    leaveRequest: {
      requestStatus: RequestStatus;
    };
  };
  params: { leaveRequestId: string };
}

export type {
  CreateNewLeaveRequestRequest,
  CreateNewLeaveRequestBulkRequest,
  DeleteALeaveRequestRequest,
  DeleteAllLeaveRequestsRequest,
  GetQueriedLeaveRequestsByUserRequest,
  GetLeaveRequestByIdRequest,
  GetQueriedLeaveRequestsRequest,
  UpdateLeaveRequestStatusByIdRequest,
};
