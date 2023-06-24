import { Request } from 'express';
import { Schema } from 'mongoose';

import { RequestAfterJWTVerification } from './auth';

interface CreateNewUserRequest extends RequestAfterJWTVerification {
  body: {
    email: string;
    username: string;
    password: string;
    roles: ('Admin' | 'Employee' | 'Manager')[];
  };
}

interface DeleteUserRequest extends RequestAfterJWTVerification {
  body: {
    id: Types.ObjectId;
  };
}

// converted to type alias instead of interface because an interface declaring no members is equivalent to its supertype and rome doesn't like that
type GetAllUsersRequest = RequestAfterJWTVerification;

interface UpdateUserRequest extends RequestAfterJWTVerification {
  body: {
    id: Types.ObjectId;
    email: string;
    username: string;
    password?: string | undefined;
    roles: ('Admin' | 'Employee' | 'Manager')[];
    active: boolean;
  };
}

interface GetAllUsersReturn {
  _id: Types.ObjectId;
  email: string;
  username: string;
  roles: ('Admin' | 'Employee' | 'Manager')[];
  active: boolean;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
}

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
