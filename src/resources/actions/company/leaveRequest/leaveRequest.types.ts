import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { LeaveRequestDocument, ReasonForLeave } from './leaveRequest.model';
import { UserRoles } from '../../../user';
import { off } from 'process';
import { RequestStatus } from '../../../../types';

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
      requestStatus: RequestStatus;
    };
  };
}

interface DeleteALeaveRequestRequest extends RequestAfterJWTVerification {
  params: {
    leaveRequestId: string;
  };
}

type DeleteAllLeaveRequestsRequest = RequestAfterJWTVerification;

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
  leaveRequestData: Array<Omit<LeaveRequestDocument, '__v'>>;
};

type QueriedLeaveRequestsServerResponse = {
  message: string;
  pages: number;
  totalDocuments: number;
  leaveRequestsData: Array<Partial<LeaveRequestDocument>>;
};

export type {
  CreateNewLeaveRequestRequest,
  DeleteALeaveRequestRequest,
  DeleteAllLeaveRequestsRequest,
  GetLeaveRequestsByUserRequest,
  GetLeaveRequestByIdRequest,
  LeaveRequestServerResponse,
  QueriedLeaveRequestsServerResponse,
};
