import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../auth";
import type { UserRoles } from "../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../types";
import { RepairNoteDocument, RepairNoteSchema } from "./repairNote.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewRepairNoteRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    repairNoteFields: Omit<RepairNoteSchema, "userId" | "username">;
  };
}

interface DeleteRepairNoteRequest extends RequestAfterJWTVerification {
  params: {
    repairNoteId: string;
  };
}

type DeleteAllRepairNotesRequest = RequestAfterJWTVerification;

type GetQueriedRepairNotesByUserRequest = GetQueriedResourceByUserRequest;
interface GetQueriedRepairNotesByParentResourceIdRequest
  extends GetQueriedResourceRequest {
  params: { parentResourceId: string };
}

interface GetRepairNoteByIdRequest extends RequestAfterJWTVerification {
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
  params: { repairNoteId: string };
}

interface UpdateRepairNoteByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<RepairNoteDocument>;
  };
  params: { repairNoteId: string };
}

type GetQueriedRepairNotesRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewRepairNotesBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    repairNoteSchemas: RepairNoteSchema[];
  };
}

// DEV ROUTE
interface UpdateRepairNotesBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    repairNoteFields: {
      repairNoteId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<RepairNoteDocument>;
    }[];
  };
}

export type {
  CreateNewRepairNoteRequest,
  CreateNewRepairNotesBulkRequest,
  DeleteAllRepairNotesRequest,
  DeleteRepairNoteRequest,
  GetRepairNoteByIdRequest,
  GetQueriedRepairNotesByParentResourceIdRequest,
  GetQueriedRepairNotesByUserRequest,
  GetQueriedRepairNotesRequest,
  UpdateRepairNoteByIdRequest,
  UpdateRepairNotesBulkRequest,
};
