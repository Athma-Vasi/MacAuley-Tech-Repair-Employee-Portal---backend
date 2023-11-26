import { Types } from 'mongoose';

import type { RequestAfterJWTVerification } from '../auth';
import type { UserRoles, UserSchema } from './user.model';
import { GetQueriedResourceRequest } from '../../types';

interface CreateNewUserRequest {
  body: {
    user: UserSchema;
  };
}

interface DeleteUserRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    userToBeDeletedId: string;
  };
}

// DEV ROUTE
interface AddFieldToUsersBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    users: {
      userId: Types.ObjectId;
      field: string;
      value: string;
    }[];
  };
}

type GetAllUsersRequest = GetQueriedResourceRequest;

type GetUsersDirectoryRequest = RequestAfterJWTVerification;

interface GetUserByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { userId: string };
}

interface UpdateUserRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    userFields: Partial<UserSchema>;
  };
}

interface UpdateUserPasswordRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    currentPassword: string;
    newPassword: string;
  };
}

export type {
  AddFieldToUsersBulkRequest,
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  GetUserByIdRequest,
  GetUsersDirectoryRequest,
  UpdateUserPasswordRequest,
  UpdateUserRequest,
};
