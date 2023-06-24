/**
 * This index -file is used to import and export user resources.
 */

/**
 * Import all the user resources.
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
  checkUserExistsService,
  createNewUserService,
  deleteUserService,
  getAllUsersService,
  updateUserService,
  checkUserIsActiveService,
  getUserByIdService,
  getUserByUsernameService,
} from './user.service';

import type { UserDocument, UserSchema } from './user.model';
import type {
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserRequest,
  GetAllUsersReturn,
} from './user.types';

/**
 * Export all the user resources.
 */
export {
  UserModel,
  userRouter,
  createNewUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  updateUserHandler,
  checkUserExistsService,
  createNewUserService,
  deleteUserService,
  getAllUsersService,
  updateUserService,
  checkUserIsActiveService,
  getUserByIdService,
  getUserByUsernameService,
};
export type {
  UserDocument,
  UserSchema,
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserRequest,
  GetAllUsersReturn,
};
