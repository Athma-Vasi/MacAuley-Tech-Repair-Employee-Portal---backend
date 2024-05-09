import { Types } from "mongoose";
import { RequestAfterJWTVerification } from "../auth";
import { UserRoles } from "../user";
import { ErrorDocument, ErrorLogSchema } from "./errorLog.model";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../types";

interface CreateNewErrorLogRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    errorLogShema: ErrorLogSchema;
  };
}

interface GetErrorLogByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { errorLogId: string };
}

type GetQueriedErrorLogsRequest = GetQueriedResourceRequest;

interface UpdateErrorLogByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<ErrorDocument>;
  };
  params: { errorLogId: string };
}

interface DeleteAnErrorLogRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { errorLogId: string };
}

type DeleteAllErrorLogsRequest = RequestAfterJWTVerification;

type GetQueriedErrorLogsByUserRequest = GetQueriedResourceByUserRequest;

// DEV ROUTE
interface CreateNewErrorLogsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    errorLogSchemas: ErrorLogSchema[];
  };
}

// DEV ROUTE
interface UpdateErrorLogsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    errorLogFields: {
      errorLogId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<ErrorDocument>;
    }[];
  };
}

export type {
  CreateNewErrorLogRequest,
  GetErrorLogByIdRequest,
  GetQueriedErrorLogsRequest,
  UpdateErrorLogByIdRequest,
  DeleteAnErrorLogRequest,
  DeleteAllErrorLogsRequest,
  GetQueriedErrorLogsByUserRequest,
  CreateNewErrorLogsBulkRequest,
  UpdateErrorLogsBulkRequest,
};
