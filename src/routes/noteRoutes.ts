import { Router } from 'express';
import {
  createNewNoteHandler,
  deleteNoteHandler,
  getAllNotesHandler,
  updateNoteHandler,
} from '../controllers/notesController';

const noteRouter = Router();

noteRouter
  .route('/')
  .get(getAllNotesHandler)
  .post(createNewNoteHandler)
  .patch(updateNoteHandler)
  .delete(deleteNoteHandler);

export { noteRouter };
