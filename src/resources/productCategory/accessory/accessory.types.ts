import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../auth";
import { UserRoles } from "../../user";
import { DocumentUpdateOperation, GetQueriedResourceRequest } from "../../../types";

import { AccessoryDocument, AccessorySchema } from "./accessory.model";

interface CreateNewAccessoryRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    accessorySchema: AccessorySchema;
  };
}

// DEV ROUTE
interface CreateNewAccessoryBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    accessorySchemas: AccessorySchema[];
  };
}

// DEV ROUTE
interface UpdateAccessoriesBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    accessoryFields: {
      documentId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<AccessoryDocument>;
    }[];
  };
}

interface DeleteAnAccessoryRequest extends RequestAfterJWTVerification {
  params: { accessoryId: string };
}

type DeleteAllAccessoriesRequest = RequestAfterJWTVerification;

type GetQueriedAccessoriesRequest = GetQueriedResourceRequest;

interface GetAccessoryByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { accessoryId: string };
}

interface UpdateAccessoryByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<AccessoryDocument>;
  };
  params: { accessoryId: string };
}

export type {
  CreateNewAccessoryRequest,
  CreateNewAccessoryBulkRequest,
  DeleteAnAccessoryRequest,
  DeleteAllAccessoriesRequest,
  GetAccessoryByIdRequest,
  GetQueriedAccessoriesRequest,
  UpdateAccessoryByIdRequest,
  UpdateAccessoriesBulkRequest,
};
