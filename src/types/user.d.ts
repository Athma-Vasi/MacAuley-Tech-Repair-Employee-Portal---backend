import { Request } from 'express';
import { Schema } from 'mongoose';

interface CreateNewUserRequest extends Request {
  body: {
    username: string;
    password: string;
    roles: ('Admin' | 'Employee' | 'Manager')[];
  };
}

interface DeleteUserRequest extends Request {
  body: {
    id: Types.ObjectId;
  };
}

// converted to type alias instead of interface because an interface declaring no members is equivalent to its supertype and rome doesn't like that
type GetAllUsersRequest = Request;

interface UpdateUserRequest extends Request {
  body: {
    id: Types.ObjectId;
    username: string;
    password?: string | undefined;
    roles: ('Admin' | 'Employee' | 'Manager')[];
    active: boolean;
  };
}

interface GetAllUsersReturn {
  _id: Types.ObjectId;
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

export {
  // user requests
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserRequest,

  // user return types from service
  GetAllUsersReturn,
};
