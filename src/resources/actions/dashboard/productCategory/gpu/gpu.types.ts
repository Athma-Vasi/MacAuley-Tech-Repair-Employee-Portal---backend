import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { GpuSchema } from './gpu.model';

interface CreateNewGpuRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    gpuFields: Omit<GpuSchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewGpuBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    gpuSchemas: GpuSchema[];
  };
}

interface DeleteAGpuRequest extends RequestAfterJWTVerification {
  params: { gpuId: string };
}

type DeleteAllGpusRequest = RequestAfterJWTVerification;

type GetQueriedGpusRequest = GetQueriedResourceRequest;

interface GetGpuByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { gpuId: string };
}

interface UpdateGpuByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    gpuFields: Record<keyof GpuSchema, GpuSchema[keyof GpuSchema]>;
  };
  params: { gpuId: string };
}

export type {
  CreateNewGpuRequest,
  CreateNewGpuBulkRequest,
  DeleteAGpuRequest,
  DeleteAllGpusRequest,
  GetGpuByIdRequest,
  GetQueriedGpusRequest,
  UpdateGpuByIdRequest,
};
