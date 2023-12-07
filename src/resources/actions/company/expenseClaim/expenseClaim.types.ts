import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../../auth";
import type { UserRoles } from "../../../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../../../types";
import { ExpenseClaimDocument, ExpenseClaimSchema } from "./expenseClaim.model";
import { FileUploadDocument } from "../../../fileUpload";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewExpenseClaimRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    expenseClaimFields: Omit<ExpenseClaimSchema, "userId" | "username">;
  };
}

interface DeleteExpenseClaimRequest extends RequestAfterJWTVerification {
  params: {
    expenseClaimId: string;
  };
}

type DeleteAllExpenseClaimsRequest = RequestAfterJWTVerification;

type GetQueriedExpenseClaimsByUserRequest = GetQueriedResourceByUserRequest;

interface GetExpenseClaimByIdRequest extends RequestAfterJWTVerification {
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
  params: { expenseClaimId: string };
}

interface UpdateExpenseClaimByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<ExpenseClaimDocument>;
  };
  params: { expenseClaimId: string };
}

type GetQueriedExpenseClaimsRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewExpenseClaimsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    expenseClaimSchemas: ExpenseClaimSchema[];
  };
}

// DEV ROUTE
interface UpdateExpenseClaimsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    expenseClaimFields: {
      expenseClaimId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<ExpenseClaimDocument>;
    }[];
  };
}

/**
 * - Type signature of document sent by the server for GET, PATCH requests.
 * - This type parameter is passed to ResourceRequestServerResponse(single document fetched by _id) or GetQueriedResourceRequestServerResponse(multiple documents fetched with filter, projection, options params),
 * - which is, in turn, passed to the Express Response type.
 * - The OmitFields type parameter is used to omit fields from the ExpenseClaimDocument type. (ex: -password or -paymentInformation)
 */
type ExpenseClaimServerResponseDocument<OmitFields extends string = string> = Omit<
  ExpenseClaimDocument,
  OmitFields
> & {
  fileUploads: FileUploadDocument[];
};

export type {
  CreateNewExpenseClaimRequest,
  CreateNewExpenseClaimsBulkRequest,
  DeleteAllExpenseClaimsRequest,
  DeleteExpenseClaimRequest,
  ExpenseClaimServerResponseDocument,
  GetExpenseClaimByIdRequest,
  GetQueriedExpenseClaimsByUserRequest,
  GetQueriedExpenseClaimsRequest,
  UpdateExpenseClaimByIdRequest,
  UpdateExpenseClaimsBulkRequest,
};
