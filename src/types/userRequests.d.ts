import { Request } from 'express';

interface CreateNewUserRequest extends Request {
  body: {
    username: string;
    password: string;
    roles: ('Admin' | 'Employee' | 'Manager')[];
  };
}

interface DeleteUserRequest extends Request {
  body: {
    id: string;
  };
}

interface GetAllUsersRequest extends Request {}

interface UpdateUserRequest extends Request {
  body: {
    id: string;
    username: string;
    password?: string | undefined;
    roles: ('Admin' | 'Employee' | 'Manager')[];
    active: boolean;
  };
}

/**
 *
 *
 *
 */

export { CreateNewUserRequest, DeleteUserRequest, GetAllUsersRequest, UpdateUserRequest };
