import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { FileUploadDocument } from '../../../../fileUpload';
import { MouseDocument, MouseSchema } from './mouse.model';

interface CreateNewMouseRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    mouseSchema: Omit<MouseSchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewMouseBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    mouseSchemas: MouseSchema[];
  };
}

interface DeleteAMouseRequest extends RequestAfterJWTVerification {
  params: { mouseId: string };
}

type DeleteAllMousesRequest = RequestAfterJWTVerification;

type GetQueriedMousesRequest = GetQueriedResourceRequest;

interface GetMouseByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { mouseId: string };
}

interface UpdateMouseByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    mouseFields: Record<keyof MouseSchema, MouseSchema[keyof MouseSchema]>;
  };
  params: { mouseId: string };
}

export type {
  CreateNewMouseRequest,
  CreateNewMouseBulkRequest,
  DeleteAMouseRequest,
  DeleteAllMousesRequest,
  GetMouseByIdRequest,
  GetQueriedMousesRequest,
  UpdateMouseByIdRequest,
};
