import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../../auth";
import type { UserRoles } from "../../../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../../../types";
import { PrinterIssueDocument, PrinterIssueSchema } from "./printerIssue.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewPrinterIssueRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    printerIssueSchema: PrinterIssueSchema;
  };
}

interface DeletePrinterIssueRequest extends RequestAfterJWTVerification {
  params: {
    printerIssueId: string;
  };
}

type DeleteAllPrinterIssuesRequest = RequestAfterJWTVerification;

type GetQueriedPrinterIssuesByUserRequest = GetQueriedResourceByUserRequest;

interface GetPrinterIssueByIdRequest extends RequestAfterJWTVerification {
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
  params: { printerIssueId: string };
}

interface UpdatePrinterIssueByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<PrinterIssueDocument>;
  };
  params: { printerIssueId: string };
}

type GetQueriedPrinterIssuesRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewPrinterIssuesBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    printerIssueSchemas: PrinterIssueSchema[];
  };
}

// DEV ROUTE
interface UpdatePrinterIssuesBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    printerIssueFields: {
      printerIssueId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<PrinterIssueDocument>;
    }[];
  };
}

export type {
  CreateNewPrinterIssueRequest,
  DeletePrinterIssueRequest,
  DeleteAllPrinterIssuesRequest,
  GetQueriedPrinterIssuesByUserRequest,
  GetPrinterIssueByIdRequest,
  GetQueriedPrinterIssuesRequest,
  UpdatePrinterIssueByIdRequest,
  CreateNewPrinterIssuesBulkRequest,
  UpdatePrinterIssuesBulkRequest,
};
