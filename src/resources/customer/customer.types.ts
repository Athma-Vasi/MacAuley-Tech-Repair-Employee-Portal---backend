import { Types } from "mongoose";

import type { RequestAfterJWTVerification } from "../auth";
import type { CustomerDocument, CustomerSchema } from "./customer.model";
import { DocumentUpdateOperation, GetQueriedResourceRequest } from "../../types";
import { UserRoles } from "../user";
import { ProductReviewDocument } from "../productReview";
import { PurchaseDocument } from "../purchase";
import { RMADocument } from "../rma";
import { SurveyDocument } from "../actions/outreach/survey";

interface CreateNewCustomerRequest {
  body: {
    customerSchema: CustomerSchema;
  };
}

interface DeleteCustomerRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { customerId: string };
}

interface DeleteAllCustomersRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
}

type GetAllCustomersRequest = GetQueriedResourceRequest;

interface GetCustomerByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { customerId: string };
}

interface UpdateCustomerRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<CustomerDocument>;
  };
  params: { customerId: string };
}

interface UpdateCustomerPasswordRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    currentPassword: string;
    newPassword: string;
  };
  params: { customerId: string };
}

// DEV ROUTE
interface CreateNewCustomersBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    customerSchemas: CustomerSchema[];
  };
}

// DEV ROUTE
interface UpdateCustomerFieldsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    customerFields: {
      customerId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<CustomerDocument>;
    }[];
  };
}

// DEV ROUTE
interface GetAllCustomersBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
}
/**
 * - Type signature of document sent by the server for GET, PATCH requests.
 * - This type parameter is passed to ResourceRequestServerResponse(single document fetched by _id) or GetQueriedResourceRequestServerResponse(multiple documents fetched with filter, projection, options params),
 * - which is, in turn, passed to the Express Response type.
 * - The OmitFields type parameter is used to omit fields from the CustomerDocument type. (ex: -password or -paymentInformation)
 */
type CustomerServerResponseDocument<OmitFields extends string = string> = Omit<
  CustomerDocument,
  OmitFields
> & {
  productReviews: ProductReviewDocument[];
  purchaseHistory: PurchaseDocument[];
  rmaHistory: RMADocument[];
  completedSurveys: SurveyDocument[];
};

export type {
  UpdateCustomerFieldsBulkRequest,
  CreateNewCustomerRequest,
  CreateNewCustomersBulkRequest,
  DeleteCustomerRequest,
  DeleteAllCustomersRequest,
  GetAllCustomersBulkRequest,
  GetAllCustomersRequest,
  GetCustomerByIdRequest,
  UpdateCustomerPasswordRequest,
  UpdateCustomerRequest,
  CustomerServerResponseDocument,
};
