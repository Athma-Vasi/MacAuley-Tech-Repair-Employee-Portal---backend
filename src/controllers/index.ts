import { loginUserHandler, logoutUserHandler, refreshTokenHandler } from './authController';

import {
  createNewUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  updateUserHandler,
} from './usersController';

import {
  createNewNoteHandler,
  deleteNoteHandler,
  getAllNotesHandler,
  updateNoteHandler,
  getNotesFromUserIdHandler,
} from './notesController';

/**
 *
 *
 *
 */

export {
  // auth
  loginUserHandler,
  logoutUserHandler,
  refreshTokenHandler,

  // user
  createNewUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  updateUserHandler,

  // note
  createNewNoteHandler,
  deleteNoteHandler,
  getAllNotesHandler,
  updateNoteHandler,
  getNotesFromUserIdHandler,
};
