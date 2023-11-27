import { Types } from 'mongoose';

import type { RequestAfterJWTVerification } from '../../auth';
import type { PurchaseOnlineSchema } from './purchaseOnline.model';
import { GetQueriedResourceByUserRequest, GetQueriedResourceRequest } from '../../../types';
import { UserRoles } from '../../user';

interface CreateNewPurchaseOnlineRequest {
  body: {
    purchaseOnlineSchema: PurchaseOnlineSchema;
  };
}

interface DeletePurchaseOnlineRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    purchaseOnlineToBeDeletedId: string;
  };
}

type GetAllPurchaseOnlinesRequest = GetQueriedResourceRequest;

type GetQueriedPurchasesOnlineByUserRequest = GetQueriedResourceByUserRequest;

interface GetPurchaseOnlineByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { purchaseOnlineId: string };
}

interface UpdatePurchaseOnlineRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    purchaseOnlineId: string;
    purchaseOnlineFields: Partial<PurchaseOnlineSchema>;
  };
}

// DEV ROUTE
interface CreateNewPurchaseOnlinesBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    purchaseOnlineSchemas: PurchaseOnlineSchema[];
  };
}

// DEV ROUTE
interface AddFieldsToPurchaseOnlinesBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    purchaseOnlineFields: {
      purchaseOnlineId: Types.ObjectId;
      purchaseOnlineFields: Record<string, any>;
    }[];
  };
}

// DEV ROUTE
interface GetAllPurchaseOnlinesBulkRequest extends RequestAfterJWTVerification {
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
  GetQueriedPurchasesOnlineByUserRequest,
  AddFieldsToPurchaseOnlinesBulkRequest,
  CreateNewPurchaseOnlineRequest,
  CreateNewPurchaseOnlinesBulkRequest,
  DeletePurchaseOnlineRequest,
  GetAllPurchaseOnlinesBulkRequest,
  GetAllPurchaseOnlinesRequest,
  GetPurchaseOnlineByIdRequest,
  UpdatePurchaseOnlineRequest,
};
