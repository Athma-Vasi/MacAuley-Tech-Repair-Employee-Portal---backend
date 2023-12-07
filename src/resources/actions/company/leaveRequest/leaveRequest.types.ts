import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../../auth";
import type { UserRoles } from "../../../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../../../types";
import { LeaveRequestDocument, LeaveRequestSchema } from "./leaveRequest.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewLeaveRequestRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    leaveRequestFields: Omit<LeaveRequestSchema, "userId" | "username">;
  };
}

interface DeleteLeaveRequestRequest extends RequestAfterJWTVerification {
  params: {
    leaveRequestId: string;
  };
}

type DeleteAllLeaveRequestsRequest = RequestAfterJWTVerification;

type GetQueriedLeaveRequestsByUserRequest = GetQueriedResourceByUserRequest;

interface GetLeaveRequestByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    newQueryFlag: boolean;
    totalDocuments: number;
  };
  query: {
    projection: string | string[] | Record<string, any>;
    options: Record<string, any>;
    filter: Record<string, any>;
  };
  params: { leaveRequestId: string };
}

interface UpdateLeaveRequestByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<LeaveRequestDocument>;
  };
  params: { leaveRequestId: string };
}

type GetQueriedLeaveRequestsRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewLeaveRequestsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    leaveRequestSchemas: LeaveRequestSchema[];
  };
}

// DEV ROUTE
interface UpdateLeaveRequestsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    leaveRequestFields: {
      leaveRequestId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<LeaveRequestDocument>;
    }[];
  };
}

export type {
  CreateNewLeaveRequestRequest,
  DeleteLeaveRequestRequest,
  DeleteAllLeaveRequestsRequest,
  GetQueriedLeaveRequestsByUserRequest,
  GetLeaveRequestByIdRequest,
  GetQueriedLeaveRequestsRequest,
  UpdateLeaveRequestByIdRequest,
  CreateNewLeaveRequestsBulkRequest,
  UpdateLeaveRequestsBulkRequest,
};
