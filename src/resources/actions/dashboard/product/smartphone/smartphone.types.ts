import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { FileUploadDocument } from '../../../../fileUpload';
import { SmartphoneDocument, SmartphoneSchema } from './smartphone.model';

interface CreateNewSmartphoneRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    smartphoneSchema: Omit<SmartphoneSchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewSmartphoneBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    smartphoneSchema: SmartphoneSchema[];
  };
}

interface DeleteASmartphoneRequest extends RequestAfterJWTVerification {
  params: { smartphoneId: string };
}

type DeleteAllSmartphonesRequest = RequestAfterJWTVerification;

type GetQueriedSmartphonesRequest = GetQueriedResourceRequest;

interface GetSmartphoneByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { smartphoneId: string };
}

interface UpdateSmartphoneByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    smartphoneFields: Record<keyof SmartphoneSchema, SmartphoneSchema[keyof SmartphoneSchema]>;
  };
  params: { smartphoneId: string };
}

export type {
  CreateNewSmartphoneRequest,
  CreateNewSmartphoneBulkRequest,
  DeleteASmartphoneRequest,
  DeleteAllSmartphonesRequest,
  GetSmartphoneByIdRequest,
  GetQueriedSmartphonesRequest,
  UpdateSmartphoneByIdRequest,
};
