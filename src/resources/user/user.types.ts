import { Types } from 'mongoose';

import type { RequestAfterJWTVerification } from '../auth';
import type {
  UserRoles,
  Country,
  Department,
  JobPosition,
  PhoneNumber,
  PostalCode,
  UserDocument,
  Province,
  StatesUS,
  PreferredPronouns,
  StoreLocation,
  UserSchema,
} from './user.model';
import { GetQueriedResourceRequest } from '../../types';

interface CreateNewUserRequest {
  body: {
    username: string;
    password: string;
    email: string;

    firstName: string;
    middleName: string;
    lastName: string;
    preferredName: string;
    preferredPronouns: PreferredPronouns;
    profilePictureUrl: string;
    dateOfBirth: NativeDate;

    contactNumber: PhoneNumber;
    address: {
      addressLine: string;
      city: string;
      province: Province | '';
      state: StatesUS | '';
      postalCode: PostalCode;
      country: Country;
    };
    jobPosition: JobPosition;
    department: Department;
    storeLocation: StoreLocation;
    emergencyContact: {
      fullName: string;
      contactNumber: PhoneNumber;
    };
    startDate: NativeDate;
    roles: UserRoles;
    active: boolean;
    completedSurveys: (Types.ObjectId | string)[];
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

interface GetUserByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: {
    userId: string;
  };
}

interface UpdateUserRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    updateObj: Partial<UserSchema>;
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

/**
 *
 *
 *
 */

export type {
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  GetUserByIdRequest,
  UpdateUserRequest,
  UpdateUserPasswordRequest,
};
