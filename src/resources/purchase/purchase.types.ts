import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../auth";
import type { UserRoles } from "../user";
import type {
  GetQueriedResourceRequest,
  GetQueriedResourceByUserRequest,
  DocumentUpdateOperation,
} from "../../types";
import { PurchaseSchema, PurchaseDocument } from "./purchase.model";
import { ProductCategoryDocument } from "../productCategory/productCategory.types";

interface CreateNewPurchaseRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    purchaseFields: Omit<PurchaseSchema, "userId" | "username">;
  };
}

// DEV ROUTE
interface CreateNewPurchasesBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    purchaseSchemas: PurchaseSchema[];
  };
}

// DEV ROUTE
interface UpdatePurchasesBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    purchaseFields: {
      purchaseId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<PurchaseDocument>;
    }[];
  };
}

interface GetAllPurchasesBulkRequest extends RequestAfterJWTVerification {
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
}

interface DeleteAPurchaseRequest extends RequestAfterJWTVerification {
  params: { purchaseId: string };
}

type DeleteAllPurchasesRequest = RequestAfterJWTVerification;

type GetQueriedPurchasesRequest = GetQueriedResourceRequest;
type GetQueriedPurchasesByUserRequest = GetQueriedResourceByUserRequest;

interface GetPurchaseByIdRequest extends RequestAfterJWTVerification {
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
  params: { purchaseId: string };
}

interface UpdatePurchaseByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<PurchaseDocument>;
  };
  params: { purchaseId: string };
}

/**
 * - Type signature of document sent by the server for GET, PATCH requests.
 * - This type parameter is passed to ResourceRequestServerResponse(single document fetched by _id) or GetQueriedResourceRequestServerResponse(multiple documents fetched with filter, projection, options params),
 * - which is, in turn, passed to the Express Response type.
 */
type PurchaseServerResponseDocument = PurchaseDocument & {
  productCategoryDocs: ProductCategoryDocument[];
};

export type {
  CreateNewPurchaseRequest,
  GetQueriedPurchasesByUserRequest,
  CreateNewPurchasesBulkRequest,
  DeleteAPurchaseRequest,
  DeleteAllPurchasesRequest,
  GetPurchaseByIdRequest,
  GetQueriedPurchasesRequest,
  UpdatePurchaseByIdRequest,
  UpdatePurchasesBulkRequest,
  GetAllPurchasesBulkRequest,
  PurchaseServerResponseDocument,
};
