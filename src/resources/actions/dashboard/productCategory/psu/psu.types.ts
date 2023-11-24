import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { PsuSchema } from './psu.model';

interface CreateNewPsuRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    psuFields: Omit<PsuSchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewPsuBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    psuSchemas: PsuSchema[];
  };
}

interface DeleteAPsuRequest extends RequestAfterJWTVerification {
  params: { psuId: string };
}

type DeleteAllPsusRequest = RequestAfterJWTVerification;

type GetQueriedPsusRequest = GetQueriedResourceRequest;

interface GetPsuByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { psuId: string };
}

interface UpdatePsuByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    psuFields: Record<keyof PsuSchema, PsuSchema[keyof PsuSchema]>;
  };
  params: { psuId: string };
}

export type {
  CreateNewPsuRequest,
  CreateNewPsuBulkRequest,
  DeleteAPsuRequest,
  DeleteAllPsusRequest,
  GetPsuByIdRequest,
  GetQueriedPsusRequest,
  UpdatePsuByIdRequest,
};
