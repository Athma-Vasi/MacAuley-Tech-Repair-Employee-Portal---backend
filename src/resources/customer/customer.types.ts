import { Types } from 'mongoose';

import type { RequestAfterJWTVerification } from '../auth';
import type { CustomerSchema } from './customer.model';
import { GetQueriedResourceRequest } from '../../types';
import { UserRoles } from '../user';

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
    customerToBeDeletedId: string;
  };
}

type GetAllCustomersRequest = GetQueriedResourceRequest;

type GetCustomersDirectoryRequest = RequestAfterJWTVerification;

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
    customerFields: Partial<CustomerSchema>;
  };
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
interface AddFieldsToCustomersBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    customerFields: {
      customerId: Types.ObjectId;
      fields: Record<string, any>;
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
  AddFieldsToCustomersBulkRequest,
  CreateNewCustomerRequest,
  CreateNewCustomersBulkRequest,
  DeleteCustomerRequest,
  GetAllCustomersBulkRequest,
  GetAllCustomersRequest,
  GetCustomerByIdRequest,
  GetCustomersDirectoryRequest,
  UpdateCustomerPasswordRequest,
  UpdateCustomerRequest,
};
