/**
 * This barrel file is used to import/export user model, router, types, handlers and services
 */

/**
 * Imports
 */
import { UserModel } from "./user.model";
import { userRouter } from "./user.routes";
import {
  createNewUserHandler,
  deleteUserHandler,
  getQueriedUsersHandler,
  updateUserByIdHandler,
} from "./user.controller";
import {
  createNewUserService,
  checkUserIsActiveService,
  deleteUserService,
  getQueriedUsersService,
  getUserByIdService,
  getUserByUsernameService,
  updateUserByIdService,
  checkUserPasswordService,
  updateUserPasswordService,
} from "./user.service";

import type {
  UserDocument,
  UserSchema,
  UserRoles,
  Country,
  Department,
  JobPosition,
  PhoneNumber,
  PostalCode,
  PreferredPronouns,
  Province,
  StatesUS,
} from "./user.model";
import type {
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserRequest,
  UpdateUserPasswordRequest,
} from "./user.types";

/**
 * Exports
 */
export {
  UserModel,
  userRouter,
  createNewUserHandler,
  deleteUserHandler,
  getQueriedUsersHandler,
  updateUserByIdHandler,
  createNewUserService,
  checkUserIsActiveService,
  deleteUserService,
  getQueriedUsersService,
  getUserByIdService,
  getUserByUsernameService,
  updateUserByIdService,
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
  PreferredPronouns,
  Province,
  StatesUS,
  UserRoles,
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserRequest,
  UpdateUserPasswordRequest,
};
