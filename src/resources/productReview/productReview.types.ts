import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../auth";
import type { UserRoles } from "../user";
import type {
  GetQueriedResourceRequest,
  GetQueriedResourceByUserRequest,
  DocumentUpdateOperation,
} from "../../types";
import type { ProductReviewDocument, ProductReviewSchema } from "./productReview.model";
import { ProductCategoryDocument } from "../productCategory/productCategory.types";

interface CreateNewProductReviewRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    productReviewFields: Omit<ProductReviewSchema, "userId" | "username">;
  };
}

// DEV ROUTE
interface CreateNewProductReviewsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    productReviewSchemas: ProductReviewSchema[];
  };
}

// DEV ROUTE
interface UpdateProductReviewsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    productReviewFields: {
      productReviewId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<ProductReviewDocument>;
    }[];
  };
}

interface GetAllProductReviewsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    // newQueryFlag: boolean;
    // totalDocuments: number;
  };
  // query: {
  //   projection: string | string[] | Record<string, any>;
  //   options: Record<string, any>;
  //   filter: Record<string, any>;
  // };
}

interface DeleteAProductReviewRequest extends RequestAfterJWTVerification {
  params: { productReviewId: string };
}

type DeleteAllProductReviewsRequest = RequestAfterJWTVerification;

type GetQueriedProductReviewsRequest = GetQueriedResourceRequest;
type GetQueriedProductReviewsByUserRequest = GetQueriedResourceByUserRequest;

interface GetProductReviewByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    // newQueryFlag: boolean;
    // totalDocuments: number;
  };
  // query: {
  //   projection: string | string[] | Record<string, any>;
  //   options: Record<string, any>;
  //   filter: Record<string, any>;
  // };
  params: { productReviewId: string };
}

interface UpdateProductReviewByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<ProductReviewDocument>;
  };
  params: { productReviewId: string };
}

/**
 * - Type signature of document sent by the server for GET, PATCH requests.
 * - This type parameter is passed to ResourceRequestServerResponse(single document fetched by _id) or GetQueriedResourceRequestServerResponse(multiple documents fetched with filter, projection, options params),
 * - which is, in turn, passed to the Express Response type.
 * - The OmitFields type parameter is used to omit fields from the ProductReviewDocument type. (ex: -password or -paymentInformation)
 */
type ProductReviewServerResponseDocument<OmitFields extends string = string> = Omit<
  ProductReviewDocument,
  OmitFields
> & {
  productCategoryDocs: ProductCategoryDocument[];
};

export type {
  CreateNewProductReviewRequest,
  CreateNewProductReviewsBulkRequest,
  DeleteAProductReviewRequest,
  DeleteAllProductReviewsRequest,
  GetAllProductReviewsBulkRequest,
  GetProductReviewByIdRequest,
  GetQueriedProductReviewsByUserRequest,
  GetQueriedProductReviewsRequest,
  ProductReviewServerResponseDocument,
  UpdateProductReviewByIdRequest,
  UpdateProductReviewsBulkRequest,
};
