import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { FileUploadDocument } from '../../../../fileUpload';
import { MotherboardDocument, MotherboardSchema } from './motherboard.model';

interface CreateNewMotherboardRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    motherboardSchema: Omit<MotherboardSchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewMotherboardBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    motherboardSchema: MotherboardSchema[];
  };
}

interface DeleteAMotherboardRequest extends RequestAfterJWTVerification {
  params: { motherboardId: string };
}

type DeleteAllMotherboardsRequest = RequestAfterJWTVerification;

type GetQueriedMotherboardsRequest = GetQueriedResourceRequest;

interface GetMotherboardByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { motherboardId: string };
}

interface UpdateMotherboardByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    motherboardFields: Record<keyof MotherboardSchema, MotherboardSchema[keyof MotherboardSchema]>;
  };
  params: { motherboardId: string };
}

export type {
  CreateNewMotherboardRequest,
  CreateNewMotherboardBulkRequest,
  DeleteAMotherboardRequest,
  DeleteAllMotherboardsRequest,
  GetMotherboardByIdRequest,
  GetQueriedMotherboardsRequest,
  UpdateMotherboardByIdRequest,
};
