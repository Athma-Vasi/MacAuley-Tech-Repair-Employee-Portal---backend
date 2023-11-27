import { Types } from 'mongoose';

import type { RequestAfterJWTVerification } from '../../auth';
import type { PurchaseInStoreSchema } from './purchaseInStore.model';
import { GetQueriedResourceByUserRequest, GetQueriedResourceRequest } from '../../../types';
import { UserRoles } from '../../user';

interface CreateNewPurchaseInStoreRequest {
  body: {
    purchaseInStoreSchema: PurchaseInStoreSchema;
  };
}

interface DeletePurchaseInStoreRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    purchaseInStoreToBeDeletedId: string;
  };
}

type GetAllPurchaseInStoresRequest = GetQueriedResourceRequest;

type GetQueriedPurchasesInStoreByUserRequest = GetQueriedResourceByUserRequest;

interface GetPurchaseInStoreByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { purchaseInStoreId: string };
}

interface UpdatePurchaseInStoreRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    purchaseInStoreId: string;
    purchaseInStoreFields: Partial<PurchaseInStoreSchema>;
  };
}

// DEV ROUTE
interface CreateNewPurchaseInStoresBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    purchaseInStoreSchemas: PurchaseInStoreSchema[];
  };
}

// DEV ROUTE
interface AddFieldsToPurchaseInStoresBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    purchaseInStoreFields: {
      purchaseInStoreId: Types.ObjectId;
      purchaseInStoreFields: Record<string, any>;
    }[];
  };
}

// DEV ROUTE
interface GetAllPurchaseInStoresBulkRequest extends RequestAfterJWTVerification {
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
  GetQueriedPurchasesInStoreByUserRequest,
  AddFieldsToPurchaseInStoresBulkRequest,
  CreateNewPurchaseInStoreRequest,
  CreateNewPurchaseInStoresBulkRequest,
  DeletePurchaseInStoreRequest,
  GetAllPurchaseInStoresBulkRequest,
  GetAllPurchaseInStoresRequest,
  GetPurchaseInStoreByIdRequest,
  UpdatePurchaseInStoreRequest,
};
