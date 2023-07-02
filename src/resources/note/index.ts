/**
 * This barrel file is used to import/export note model, router, types, handlers and services
 */

/**
 * Imports
 */
import { NoteModel } from './note.model';
import { noteRouter } from './note.routes';
import {
  createNewNoteHandler,
  deleteNoteHandler,
  getAllNotesHandler,
  getNotesFromUserIdHandler,
  updateNoteHandler,
} from './note.controller';
import {
  checkNoteExistsService,
  createNewNoteService,
  deleteNoteService,
  getAllNotesService,
  getNotesByUserService,
  updateNoteService,
} from './note.service';

import type { NoteDocument, NoteSchema } from './note.model';
import type {
  CreateNewNoteRequest,
  DeleteNoteRequest,
  GetAllNotesRequest,
  GetAllNotesReturn,
  GetNotesFromUserIdRequest,
  UpdateNoteRequest,
} from './note.types';

/**
 * Exports
 */
export {
  NoteModel,
  noteRouter,
  createNewNoteHandler,
  deleteNoteHandler,
  getAllNotesHandler,
  getNotesFromUserIdHandler,
  updateNoteHandler,
  checkNoteExistsService,
  createNewNoteService,
  deleteNoteService,
  getAllNotesService,
  getNotesByUserService,
  updateNoteService,
};
export type {
  NoteDocument,
  NoteSchema,
  CreateNewNoteRequest,
  DeleteNoteRequest,
  GetAllNotesRequest,
  GetAllNotesReturn,
  GetNotesFromUserIdRequest,
  UpdateNoteRequest,
};
