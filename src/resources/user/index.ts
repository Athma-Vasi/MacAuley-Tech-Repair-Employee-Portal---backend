/**
 * This barrel file is used to import/export user model, router, types, handlers and services
 */

/**
 * Imports
 */
import { UserModel } from './user.model';
import { userRouter } from './user.routes';
import {
  createNewUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  updateUserHandler,
} from './user.controller';
import {
  createNewUserService,
  checkUserExistsService,
  checkUserIsActiveService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  getUserByUsernameService,
  updateUserService,
  checkUserPasswordService,
  updateUserPasswordService,
} from './user.service';

import type {
  UserDocument,
  UserSchema,
  UserRoles,
  Country,
  Department,
  JobPosition,
  PhoneNumber,
  PostalCode,
} from './user.model';
import type {
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserRequest,
  UpdateUserPasswordRequest,
  UserServerResponse,
} from './user.types';

/**
 * Exports
 */
export {
  UserModel,
  userRouter,
  createNewUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  updateUserHandler,
  createNewUserService,
  checkUserExistsService,
  checkUserIsActiveService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  getUserByUsernameService,
  updateUserService,
  checkUserPasswordService,
  updateUserPasswordService,
};
export type {
  UserDocument,
  UserSchema,
  Country,
  Department,
  JobPosition,
  PhoneNumber,
  PostalCode,
  UserRoles,
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserRequest,
  UpdateUserPasswordRequest,
  UserServerResponse,
};
