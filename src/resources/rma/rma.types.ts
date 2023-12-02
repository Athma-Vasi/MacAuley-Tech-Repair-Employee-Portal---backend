import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../auth";
import type { UserRoles } from "../user";
import type {
  GetQueriedResourceRequest,
  GetQueriedResourceByUserRequest,
  DocumentUpdateOperation,
} from "../../types";
import { RMASchema, RMADocument } from "./rma.model";

interface CreateNewRMARequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    rmaFields: Omit<RMASchema, "userId" | "username">;
  };
}

// DEV ROUTE
interface CreateNewRMAsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    rmaSchemas: RMASchema[];
  };
}

// DEV ROUTE
interface UpdateRMAsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    rmaFields: {
      rmaId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<RMADocument>;
    }[];
  };
}

interface GetAllRMAsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
}

interface DeleteARMARequest extends RequestAfterJWTVerification {
  params: { rmaId: string };
}

type DeleteAllRMAsRequest = RequestAfterJWTVerification;

type GetQueriedRMAsRequest = GetQueriedResourceRequest;
type GetQueriedRMAsByUserRequest = GetQueriedResourceByUserRequest;

interface GetRMAByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { rmaId: string };
}

interface UpdateRMAByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<RMADocument>;
  };
  params: { rmaId: string };
}

export type {
  CreateNewRMARequest,
  GetQueriedRMAsByUserRequest,
  CreateNewRMAsBulkRequest,
  DeleteARMARequest,
  DeleteAllRMAsRequest,
  GetRMAByIdRequest,
  GetQueriedRMAsRequest,
  UpdateRMAByIdRequest,
  UpdateRMAsBulkRequest,
  GetAllRMAsBulkRequest,
};
