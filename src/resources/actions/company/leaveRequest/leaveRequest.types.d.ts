import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { LeaveRequestDocument } from './leaveRequest.model';

interface CreateNewLeaveRequestRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
    };
    leaveRequest: {
      leaveType: string;
      startDate: Date;
      endDate: Date;
      reasonForLeave: string;
      delegatedToEmployee: string;
      delegatedResponsibilities: string;
      additionalComments: string;
      acknowledgement: boolean;
    };
  };
}

interface DeleteALeaveRequestRequest extends RequestAfterJWTVerification {
  params: {
    leaveRequestId: Types.ObjectId;
  };
}

type DeleteAllLeaveRequestsRequest = RequestAfterJWTVerification;

type GetAllLeaveRequestsRequest = RequestAfterJWTVerification;

type GetLeaveRequestsByUserRequest = RequestAfterJWTVerification;

interface GetALeaveRequestRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    leaveRequestId: Types.ObjectId;
  };
}

type LeaveRequestServerResponse = {
  message: string;
  leaveRequestData: Array<LeaveRequestDocument>;
};

export type {
  CreateNewLeaveRequestRequest,
  DeleteALeaveRequestRequest,
  DeleteAllLeaveRequestsRequest,
  GetAllLeaveRequestsRequest,
  GetLeaveRequestsByUserRequest,
  GetALeaveRequestRequest,
  LeaveRequestServerResponse,
};
