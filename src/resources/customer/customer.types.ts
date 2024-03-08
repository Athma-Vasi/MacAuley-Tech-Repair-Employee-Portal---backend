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
    // newQueryFlag: boolean;
    // totalDocuments: number;
  };
  // query: {
  //   projection: string | string[] | Record<string, any>;
  //   options: Record<string, any>;
  //   filter: Record<string, any>;
  // };
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
    newQueryFlag: boolean;
    totalDocuments: number;
  };
  query: {
    projection: string | string[] | Record<string, any>;
    options: Record<string, any>;
    filter: Record<string, any>;
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
    // newQueryFlag: boolean;
    // totalDocuments: number;
  };
  // query: {
  //   projection: string | string[] | Record<string, any>;
  //   options: Record<string, any>;
  //   filter: Record<string, any>;
  // };
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
};
