import { Request } from 'express';

interface CreateNewUserRequest extends Request {
  body: {
    username: string;
    password: string;
    roles: ('Admin' | 'Employee' | 'Manager')[];
  };
}

interface DeleteUserRequest extends Request {}

interface GetAllUsersRequest extends Request {}

interface UpdateUserRequest extends Request {}

/**
 *
 *
 *
 */

export { CreateNewUserRequest, DeleteUserRequest, GetAllUsersRequest, UpdateUserRequest };
