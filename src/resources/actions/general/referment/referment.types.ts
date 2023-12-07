import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../../auth";
import type { UserRoles } from "../../../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../../../types";
import { RefermentDocument, RefermentSchema } from "./referment.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewRefermentRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    refermentSchema: RefermentSchema;
  };
}

interface DeleteRefermentRequest extends RequestAfterJWTVerification {
  params: {
    refermentId: string;
  };
}

type DeleteAllRefermentsRequest = RequestAfterJWTVerification;

type GetQueriedRefermentsByUserRequest = GetQueriedResourceByUserRequest;

interface GetRefermentByIdRequest extends RequestAfterJWTVerification {
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
  params: { refermentId: string };
}

interface UpdateRefermentByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<RefermentDocument>;
  };
  params: { refermentId: string };
}

type GetQueriedRefermentsRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewRefermentsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    refermentSchemas: RefermentSchema[];
  };
}

// DEV ROUTE
interface UpdateRefermentsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    refermentFields: {
      refermentId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<RefermentDocument>;
    }[];
  };
}

export type {
  CreateNewRefermentRequest,
  DeleteRefermentRequest,
  DeleteAllRefermentsRequest,
  GetQueriedRefermentsByUserRequest,
  GetRefermentByIdRequest,
  GetQueriedRefermentsRequest,
  UpdateRefermentByIdRequest,
  CreateNewRefermentsBulkRequest,
  UpdateRefermentsBulkRequest,
};
