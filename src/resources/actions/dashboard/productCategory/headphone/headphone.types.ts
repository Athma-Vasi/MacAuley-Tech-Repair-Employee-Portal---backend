import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { FileUploadDocument } from '../../../../fileUpload';
import { HeadphoneDocument, HeadphoneSchema } from './headphone.model';

interface CreateNewHeadphoneRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    headphoneSchema: Omit<HeadphoneSchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewHeadphoneBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    headphoneSchemas: HeadphoneSchema[];
  };
}

interface DeleteAHeadphoneRequest extends RequestAfterJWTVerification {
  params: { headphoneId: string };
}

type DeleteAllHeadphonesRequest = RequestAfterJWTVerification;

type GetQueriedHeadphonesRequest = GetQueriedResourceRequest;

interface GetHeadphoneByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { headphoneId: string };
}

interface UpdateHeadphoneByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    headphoneFields: Record<keyof HeadphoneSchema, HeadphoneSchema[keyof HeadphoneSchema]>;
  };
  params: { headphoneId: string };
}

export type {
  CreateNewHeadphoneRequest,
  CreateNewHeadphoneBulkRequest,
  DeleteAHeadphoneRequest,
  DeleteAllHeadphonesRequest,
  GetHeadphoneByIdRequest,
  GetQueriedHeadphonesRequest,
  UpdateHeadphoneByIdRequest,
};
