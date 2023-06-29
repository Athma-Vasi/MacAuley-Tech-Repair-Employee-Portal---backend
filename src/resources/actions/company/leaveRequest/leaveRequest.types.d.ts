import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { LeaveRequestDocument, ReasonForLeave } from './leaveRequest.model';
import { UserRoles } from '../../../user';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) to the request body
interface CreateNewLeaveRequestRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
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

interface DeleteALeaveRequestRequest extends RequestAfterJWTVerification {
  params: {
    leaveRequestId: Types.ObjectId;
  };
}

type DeleteAllLeaveRequestsRequest = RequestAfterJWTVerification;

type GetAllLeaveRequestsRequest = RequestAfterJWTVerification;

type GetLeaveRequestsByUserRequest = RequestAfterJWTVerification;

interface GetLeaveRequestByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { leaveRequestId: Types.ObjectId };
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
  GetLeaveRequestByIdRequest,
  LeaveRequestServerResponse,
};
