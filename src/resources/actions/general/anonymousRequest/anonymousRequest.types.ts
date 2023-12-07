import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../../auth";
import type { UserRoles } from "../../../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../../../types";
import {
  AnonymousRequestDocument,
  AnonymousRequestSchema,
} from "./anonymousRequest.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewAnonymousRequestRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    anonymousRequestSchema: AnonymousRequestSchema;
  };
}

interface DeleteAnonymousRequestRequest extends RequestAfterJWTVerification {
  params: {
    anonymousRequestId: string;
  };
}

type DeleteAllAnonymousRequestsRequest = RequestAfterJWTVerification;

type GetQueriedAnonymousRequestsByUserRequest = GetQueriedResourceByUserRequest;

interface GetAnonymousRequestByIdRequest extends RequestAfterJWTVerification {
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
  params: { anonymousRequestId: string };
}

interface UpdateAnonymousRequestByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<AnonymousRequestDocument>;
  };
  params: { anonymousRequestId: string };
}

type GetQueriedAnonymousRequestsRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewAnonymousRequestsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    anonymousRequestSchemas: AnonymousRequestSchema[];
  };
}

// DEV ROUTE
interface UpdateAnonymousRequestsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    anonymousRequestFields: {
      anonymousRequestId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<AnonymousRequestDocument>;
    }[];
  };
}

export type {
  CreateNewAnonymousRequestRequest,
  DeleteAnonymousRequestRequest,
  DeleteAllAnonymousRequestsRequest,
  GetQueriedAnonymousRequestsByUserRequest,
  GetAnonymousRequestByIdRequest,
  GetQueriedAnonymousRequestsRequest,
  UpdateAnonymousRequestByIdRequest,
  CreateNewAnonymousRequestsBulkRequest,
  UpdateAnonymousRequestsBulkRequest,
};
