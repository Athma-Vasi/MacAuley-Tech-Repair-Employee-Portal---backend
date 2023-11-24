import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { LaptopSchema } from './laptop.model';

interface CreateNewLaptopRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    laptopFields: Omit<LaptopSchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewLaptopBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    laptopSchemas: LaptopSchema[];
  };
}

interface DeleteALaptopRequest extends RequestAfterJWTVerification {
  params: { laptopId: string };
}

type DeleteAllLaptopsRequest = RequestAfterJWTVerification;

type GetQueriedLaptopsRequest = GetQueriedResourceRequest;

interface GetLaptopByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { laptopId: string };
}

interface UpdateLaptopByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    laptopFields: Record<keyof LaptopSchema, LaptopSchema[keyof LaptopSchema]>;
  };
  params: { laptopId: string };
}

export type {
  CreateNewLaptopRequest,
  CreateNewLaptopBulkRequest,
  DeleteALaptopRequest,
  DeleteAllLaptopsRequest,
  GetLaptopByIdRequest,
  GetQueriedLaptopsRequest,
  UpdateLaptopByIdRequest,
};
