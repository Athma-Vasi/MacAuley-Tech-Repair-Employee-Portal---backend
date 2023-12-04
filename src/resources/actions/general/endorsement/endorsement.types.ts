import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../../auth";
import type { UserRoles } from "../../../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../../../types";
import { EndorsementDocument, EndorsementSchema } from "./endorsement.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewEndorsementRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    endorsementSchema: EndorsementSchema;
  };
}

interface DeleteEndorsementRequest extends RequestAfterJWTVerification {
  params: {
    endorsementId: string;
  };
}

type DeleteAllEndorsementsRequest = RequestAfterJWTVerification;

type GetQueriedEndorsementsByUserRequest = GetQueriedResourceByUserRequest;

interface GetEndorsementByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { endorsementId: string };
}

interface UpdateEndorsementByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<EndorsementDocument>;
  };
  params: { endorsementId: string };
}

type GetQueriedEndorsementsRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewEndorsementsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    endorsementSchemas: EndorsementSchema[];
  };
}

// DEV ROUTE
interface UpdateEndorsementsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    endorsementFields: {
      endorsementId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<EndorsementDocument>;
    }[];
  };
}

export type {
  CreateNewEndorsementRequest,
  DeleteEndorsementRequest,
  DeleteAllEndorsementsRequest,
  GetQueriedEndorsementsByUserRequest,
  GetEndorsementByIdRequest,
  GetQueriedEndorsementsRequest,
  UpdateEndorsementByIdRequest,
  CreateNewEndorsementsBulkRequest,
  UpdateEndorsementsBulkRequest,
};
