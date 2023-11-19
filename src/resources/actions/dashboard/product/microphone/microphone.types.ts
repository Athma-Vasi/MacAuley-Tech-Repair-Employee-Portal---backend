import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { FileUploadDocument } from '../../../../fileUpload';
import { MicrophoneDocument, MicrophoneSchema } from './microphone.model';

interface CreateNewMicrophoneRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    microphoneSchema: Omit<MicrophoneSchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewMicrophoneBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    microphoneSchema: MicrophoneSchema[];
  };
}

interface DeleteAMicrophoneRequest extends RequestAfterJWTVerification {
  params: { microphoneId: string };
}

type DeleteAllMicrophonesRequest = RequestAfterJWTVerification;

type GetQueriedMicrophonesRequest = GetQueriedResourceRequest;

interface GetMicrophoneByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { microphoneId: string };
}

interface UpdateMicrophoneByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    microphoneFields: Record<keyof MicrophoneSchema, MicrophoneSchema[keyof MicrophoneSchema]>;
  };
  params: { microphoneId: string };
}

export type {
  CreateNewMicrophoneRequest,
  CreateNewMicrophoneBulkRequest,
  DeleteAMicrophoneRequest,
  DeleteAllMicrophonesRequest,
  GetMicrophoneByIdRequest,
  GetQueriedMicrophonesRequest,
  UpdateMicrophoneByIdRequest,
};
