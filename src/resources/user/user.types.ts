import { Types } from 'mongoose';

import type { RequestAfterJWTVerification } from '../auth';
import type {
  UserRoles,
  Country,
  Department,
  JobPosition,
  PhoneNumber,
  PostalCode,
  Province,
  StatesUS,
  PreferredPronouns,
  StoreLocation,
  UserSchema,
  UserDocument,
} from './user.model';
import { GetQueriedResourceRequest } from '../../types';

type DirectoryUserDocument = Omit<
  UserDocument,
  | 'password'
  | '__v'
  | 'dateOfBirth'
  | 'address'
  | 'contactNumber'
  | 'emergencyContact'
  | 'startDate'
  | 'completedSurveys'
  | 'email'
>;

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
    userToBeDeletedId: string;
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
    currentPassword: string;
    newPassword: string;
  };
}

export type {
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  GetUserByIdRequest,
  UpdateUserRequest,
  UpdateUserPasswordRequest,
  GetUsersDirectoryRequest,
  DirectoryUserDocument,
};
