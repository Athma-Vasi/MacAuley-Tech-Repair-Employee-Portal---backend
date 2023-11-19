import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { FileUploadDocument } from '../../../../fileUpload';
import { AccessoryDocument, AccessorySchema } from './accessory.model';

interface CreateNewAccessoryRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    accessorySchema: Omit<AccessorySchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewAccessoryBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    accessorySchemas: AccessorySchema[];
  };
}

interface DeleteAnAccessoryRequest extends RequestAfterJWTVerification {
  params: { accessoryId: string };
}

type DeleteAllAccessoriesRequest = RequestAfterJWTVerification;

type GetQueriedAccessoriesRequest = GetQueriedResourceRequest;

interface GetAccessoryByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { accessoryId: string };
}

interface UpdateAccessoryByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    accessoryFields: Record<keyof AccessorySchema, AccessorySchema[keyof AccessorySchema]>;
  };
  params: { accessoryId: string };
}

export type {
  CreateNewAccessoryRequest,
  CreateNewAccessoryBulkRequest,
  DeleteAnAccessoryRequest,
  DeleteAllAccessoriesRequest,
  GetAccessoryByIdRequest,
  GetQueriedAccessoriesRequest,
  UpdateAccessoryByIdRequest,
};
