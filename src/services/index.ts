import {
  createNewNoteService,
  checkNoteExistsService,
  deleteNoteService,
  getAllNotesService,
  getNotesByUserService,
  updateNoteService,
} from './noteService';

import {
  createNewUserService,
  checkUserExistsService,
  checkUserIsActiveService,
  deleteUserService,
  getAllUsersService,
  getUserByUsernameService,
  getUserByIdService,
  updateUserService,
} from './userService';

/**
 *
 *
 *
 */

export {
  // note service
  createNewNoteService,
  checkNoteExistsService,
  deleteNoteService,
  getAllNotesService,
  getNotesByUserService,
  updateNoteService,

  // user service
  createNewUserService,
  checkUserExistsService,
  checkUserIsActiveService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  getUserByUsernameService,
  updateUserService,
};
