import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { FileUploadDocument } from '../../../../fileUpload';
import { RamDocument, RamSchema } from './ram.model';

interface CreateNewRamRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    ramSchema: Omit<RamSchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewRamBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    ramSchema: RamSchema[];
  };
}

interface DeleteARamRequest extends RequestAfterJWTVerification {
  params: { ramId: string };
}

type DeleteAllRamsRequest = RequestAfterJWTVerification;

type GetQueriedRamsRequest = GetQueriedResourceRequest;

interface GetRamByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { ramId: string };
}

interface UpdateRamByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    ramFields: Record<keyof RamSchema, RamSchema[keyof RamSchema]>;
  };
  params: { ramId: string };
}

export type {
  CreateNewRamRequest,
  CreateNewRamBulkRequest,
  DeleteARamRequest,
  DeleteAllRamsRequest,
  GetRamByIdRequest,
  GetQueriedRamsRequest,
  UpdateRamByIdRequest,
};
