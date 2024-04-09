import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../auth";
import type { UserRoles } from "../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../types";
import { RepairTicketDocument, RepairTicketSchema } from "./repairTicket.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewRepairTicketRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    repairTicketSchema: Omit<RepairTicketSchema, "userId" | "username">;
  };
}

interface DeleteRepairTicketRequest extends RequestAfterJWTVerification {
  params: {
    repairTicketId: string;
  };
}

type DeleteAllRepairTicketsRequest = RequestAfterJWTVerification;

type GetQueriedRepairTicketsByUserRequest = GetQueriedResourceByUserRequest;
interface GetQueriedRepairTicketsByParentResourceIdRequest
  extends GetQueriedResourceRequest {
  params: { parentResourceId: string };
}

interface GetRepairTicketByIdRequest extends RequestAfterJWTVerification {
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
  params: { repairTicketId: string };
}

interface UpdateRepairTicketByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<RepairTicketDocument>;
  };
  params: { repairTicketId: string };
}

type GetQueriedRepairTicketsRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewRepairTicketsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    repairTicketSchemas: RepairTicketSchema[];
  };
}

// DEV ROUTE
interface UpdateRepairTicketsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    repairTicketFields: {
      repairTicketId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<RepairTicketDocument>;
    }[];
  };
}

export type {
  CreateNewRepairTicketRequest,
  CreateNewRepairTicketsBulkRequest,
  DeleteAllRepairTicketsRequest,
  DeleteRepairTicketRequest,
  GetRepairTicketByIdRequest,
  GetQueriedRepairTicketsByParentResourceIdRequest,
  GetQueriedRepairTicketsByUserRequest,
  GetQueriedRepairTicketsRequest,
  UpdateRepairTicketByIdRequest,
  UpdateRepairTicketsBulkRequest,
};
