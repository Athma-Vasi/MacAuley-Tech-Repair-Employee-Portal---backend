import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { LeaveRequestDocument, ReasonForLeave } from './leaveRequest.model';
import { UserRoles } from '../../../user';
import { off } from 'process';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
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
    leaveRequestId: string;
  };
}

type DeleteAllLeaveRequestsRequest = RequestAfterJWTVerification;

interface GetQueriedLeaveRequestsRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    newQueryFlag: boolean;
    totalDocuments: number;
  };
}

type GetLeaveRequestsByUserRequest = RequestAfterJWTVerification;

interface GetLeaveRequestByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { leaveRequestId: string };
}

type LeaveRequestServerResponse = {
  message: string;
  leaveRequestData: Array<LeaveRequestDocument>;
};

type LeaveRequestsQueryServerResponse = {
  message: string;
  pages: number;
  totalDocuments: number;
  leaveRequestsData: Array<LeaveRequestDocument>;
};

export type {
  CreateNewLeaveRequestRequest,
  DeleteALeaveRequestRequest,
  DeleteAllLeaveRequestsRequest,
  GetQueriedLeaveRequestsRequest,
  GetLeaveRequestsByUserRequest,
  GetLeaveRequestByIdRequest,
  LeaveRequestServerResponse,
  LeaveRequestsQueryServerResponse,
};
