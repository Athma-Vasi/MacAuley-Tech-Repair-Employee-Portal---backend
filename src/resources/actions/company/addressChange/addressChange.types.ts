import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../../auth";
import type { UserRoles } from "../../../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../../../types";
import { AddressChangeDocument, AddressChangeSchema } from "./addressChange.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewAddressChangeRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    addressChangeSchema: Omit<AddressChangeSchema, "userId" | "username">;
  };
}

interface DeleteAnAddressChangeRequest extends RequestAfterJWTVerification {
  params: {
    addressChangeId: string;
  };
}

type DeleteAllAddressChangesRequest = RequestAfterJWTVerification;

type GetQueriedAddressChangesByUserRequest = GetQueriedResourceByUserRequest;

interface GetAddressChangeByIdRequest extends RequestAfterJWTVerification {
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
  params: { addressChangeId: string };
}

interface UpdateAddressChangeByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<AddressChangeDocument>;
  };
  params: { addressChangeId: string };
}

type GetQueriedAddressChangesRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewAddressChangesBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    addressChangeSchemas: AddressChangeSchema[];
  };
}

// DEV ROUTE
interface UpdateAddressChangesBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    addressChangeFields: {
      addressChangeId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<AddressChangeDocument>;
    }[];
  };
}

export type {
  CreateNewAddressChangeRequest,
  DeleteAnAddressChangeRequest,
  DeleteAllAddressChangesRequest,
  GetQueriedAddressChangesByUserRequest,
  GetAddressChangeByIdRequest,
  GetQueriedAddressChangesRequest,
  UpdateAddressChangeByIdRequest,
  CreateNewAddressChangesBulkRequest,
  UpdateAddressChangesBulkRequest,
};
