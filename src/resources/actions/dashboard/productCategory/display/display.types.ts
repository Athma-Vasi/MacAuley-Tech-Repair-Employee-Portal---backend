import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { DisplaySchema } from './display.model';

interface CreateNewDisplayRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    displayFields: Omit<DisplaySchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewDisplayBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    displaySchemas: DisplaySchema[];
  };
}

interface DeleteADisplayRequest extends RequestAfterJWTVerification {
  params: { displayId: string };
}

type DeleteAllDisplaysRequest = RequestAfterJWTVerification;

type GetQueriedDisplaysRequest = GetQueriedResourceRequest;

interface GetDisplayByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { displayId: string };
}

interface UpdateDisplayByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    displayFields: Record<keyof DisplaySchema, DisplaySchema[keyof DisplaySchema]>;
  };
  params: { displayId: string };
}

export type {
  CreateNewDisplayRequest,
  CreateNewDisplayBulkRequest,
  DeleteADisplayRequest,
  DeleteAllDisplaysRequest,
  GetDisplayByIdRequest,
  GetQueriedDisplaysRequest,
  UpdateDisplayByIdRequest,
};
