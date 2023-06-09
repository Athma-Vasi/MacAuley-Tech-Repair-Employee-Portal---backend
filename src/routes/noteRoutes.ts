import { Router } from 'express';
import {
  createNewNoteHandler,
  deleteNoteHandler,
  getAllNotesHandler,
  updateNoteHandler,
} from '../controllers';

const noteRouter = Router();

noteRouter
  .route('/')
  .get(getAllNotesHandler)
  .post(createNewNoteHandler)
  .patch(updateNoteHandler)
  .delete(deleteNoteHandler);

export { noteRouter };
