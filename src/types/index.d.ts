import { LoginUserRequest, LogoutUserRequest, RefreshTokenRequest } from './auth';

import {
  // note request types from client
  CreateNewNoteRequest,
  DeleteNoteRequest,
  GetAllNotesRequest,
  UpdateNoteRequest,

  // note return types from service
  GetAllNotesReturn,
} from './note';

import {
  // user request types from client
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserRequest,

  // user return types from service
  GetAllUsersReturn,
} from './user';

/**
 *
 *
 *
 */

export {
  // auth requests from client
  LoginUserRequest,
  LogoutUserRequest,
  RefreshTokenRequest,

  // user requests from client
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserRequest,
  // user return types from service
  GetAllUsersReturn,

  // note requests from client
  CreateNewNoteRequest,
  DeleteNoteRequest,
  GetAllNotesRequest,
  UpdateNoteRequest,
  // note return types from service
  GetAllNotesReturn,
};
