import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../auth";
import type { UserRoles } from "../user";
import type {
  GetQueriedResourceRequest,
  GetQueriedResourceByUserRequest,
  DocumentUpdateOperation,
} from "../../types";
import { PurchaseSchema, PurchaseDocument } from "./purchase.model";
import { ProductCategoryDocument } from "../productCategory/product.types";

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
 * type signature of response object sent by the server for GET, PATCH, requests
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
