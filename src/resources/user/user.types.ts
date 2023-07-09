import { Request } from 'express';
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
} from './user.model';

interface CreateNewUserRequest {
  body: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    middleName: string;
    lastName: string;
    contactNumber: PhoneNumber;
    address: {
      addressLine1: string;
      city: string;
      province: Province;
      state: StatesUS;
      postalCode: PostalCode;
      country: Country;
    };
    jobPosition: JobPosition;
    department: Department;
    emergencyContact: {
      fullName: string;
      contactNumber: PhoneNumber;
    };
    startDate: NativeDate;
    roles: UserRoles;
    active: boolean;
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

// converted to type alias instead of interface because an interface declaring no members is equivalent to its supertype and rome doesn't like that
type GetAllUsersRequest = RequestAfterJWTVerification;

interface UpdateUserRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    email: string;
    firstName: string;
    middleName: string;
    lastName: string;
    contactNumber: PhoneNumber;
    address: {
      addressLine1: string;
      city: string;
      province: Province;
      state: StatesUS;
      postalCode: PostalCode;
      country: Country;
    };
    jobPosition: JobPosition;
    department: Department;
    emergencyContact: {
      fullName: string;
      contactNumber: PhoneNumber;
    };
    startDate: NativeDate;
    active: boolean;
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

type UsersServerResponse = {
  message: string;
  userData?: UserDatabaseResponse[] | undefined;
};

type UserDatabaseResponse = Omit<UserDocument, 'password'>;

/**
 *
 *
 *
 */

export type {
  // user requests
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserRequest,
  UpdateUserPasswordRequest,

  // user return types
  UsersServerResponse,
  UserDatabaseResponse,
};