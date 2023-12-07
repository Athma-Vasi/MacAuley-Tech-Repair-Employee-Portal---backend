import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../../auth";
import type { UserRoles } from "../../../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../../../types";
import { RequestResourceDocument, RequestResourceSchema } from "./requestResource.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewRequestResourceRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    requestResourceFields: Omit<RequestResourceSchema, "userId" | "username">;
  };
}

interface DeleteRequestResourceRequest extends RequestAfterJWTVerification {
  params: {
    requestResourceId: string;
  };
}

type DeleteAllRequestResourcesRequest = RequestAfterJWTVerification;

type GetQueriedRequestResourcesByUserRequest = GetQueriedResourceByUserRequest;

interface GetRequestResourceByIdRequest extends RequestAfterJWTVerification {
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
  params: { requestResourceId: string };
}

interface UpdateRequestResourceByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<RequestResourceDocument>;
  };
  params: { requestResourceId: string };
}

type GetQueriedRequestResourcesRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewRequestResourcesBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    requestResourceSchemas: RequestResourceSchema[];
  };
}

// DEV ROUTE
interface UpdateRequestResourcesBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    requestResourceFields: {
      requestResourceId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<RequestResourceDocument>;
    }[];
  };
}

export type {
  CreateNewRequestResourceRequest,
  DeleteRequestResourceRequest,
  DeleteAllRequestResourcesRequest,
  GetQueriedRequestResourcesByUserRequest,
  GetRequestResourceByIdRequest,
  GetQueriedRequestResourcesRequest,
  UpdateRequestResourceByIdRequest,
  CreateNewRequestResourcesBulkRequest,
  UpdateRequestResourcesBulkRequest,
};
