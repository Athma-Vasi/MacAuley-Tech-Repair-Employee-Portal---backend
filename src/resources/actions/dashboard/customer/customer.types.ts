import { Types } from 'mongoose';

import type { RequestAfterJWTVerification } from '../../../auth';
import type { CustomerSchema } from './customer.model';
import { GetQueriedResourceRequest } from '../../../../types';
import { UserRoles } from '../../../user';

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

export type {
  AddFieldsToCustomersBulkRequest,
  CreateNewCustomerRequest,
  DeleteCustomerRequest,
  GetAllCustomersRequest,
  GetCustomerByIdRequest,
  GetCustomersDirectoryRequest,
  UpdateCustomerPasswordRequest,
  UpdateCustomerRequest,
};
