import { Request } from 'express';

import type { RequestAfterJWTVerification } from '../auth';
import type {
  UserRoles,
  Countries,
  Departments,
  JobPositions,
  PhoneNumber,
  PostalCodes,
} from './user.model';

interface CreateNewUserRequest extends RequestAfterJWTVerification {
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
      province: string;
      state: string;
      postalCode: PostalCodes;
      country: Countries;
    };
    jobPosition: JobPositions;
    department: Departments;
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
  params: {
    userId: Types.ObjectId;
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
    password: string;
    firstName: string;
    middleName: string;
    lastName: string;
    contactNumber: PhoneNumber;
    address: {
      addressLine1: string;
      city: string;
      province: string;
      state: string;
      postalCode: PostalCodes;
      country: Countries;
    };
    jobPosition: JobPositions;
    department: Departments;
    emergencyContact: {
      fullName: string;
      contactNumber: PhoneNumber;
    };
    startDate: NativeDate;
    active: boolean;
  };
}

type UserServerResponse = {
  message: string;
};

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

  // user return types from service
  GetAllUsersReturn,
};
