import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { FileUploadDocument } from '../../../../fileUpload';
import { KeyboardDocument, KeyboardSchema } from './keyboard.model';

interface CreateNewKeyboardRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    keyboardSchema: Omit<KeyboardSchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewKeyboardBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    keyboardSchema: KeyboardSchema[];
  };
}

interface DeleteAKeyboardRequest extends RequestAfterJWTVerification {
  params: { keyboardId: string };
}

type DeleteAllKeyboardsRequest = RequestAfterJWTVerification;

type GetQueriedKeyboardsRequest = GetQueriedResourceRequest;

interface GetKeyboardByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { keyboardId: string };
}

interface UpdateKeyboardByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    keyboardFields: Record<keyof KeyboardSchema, KeyboardSchema[keyof KeyboardSchema]>;
  };
  params: { keyboardId: string };
}

export type {
  CreateNewKeyboardRequest,
  CreateNewKeyboardBulkRequest,
  DeleteAKeyboardRequest,
  DeleteAllKeyboardsRequest,
  GetKeyboardByIdRequest,
  GetQueriedKeyboardsRequest,
  UpdateKeyboardByIdRequest,
};
