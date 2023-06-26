import { Router } from 'express';

import { verifyJWTMiddleware } from '../../middlewares';
import {
  createNewNoteHandler,
  deleteNoteHandler,
  getAllNotesHandler,
  updateNoteHandler,
  getNotesFromUserIdHandler,
} from './note.controller';

const noteRouter = Router();

// verifyJWT middleware is applied to all routes in this router
noteRouter.use(verifyJWTMiddleware);

noteRouter.route('/:userId').get(getNotesFromUserIdHandler);

noteRouter
  .route('/')
  .get(getAllNotesHandler)
  .post(createNewNoteHandler)
  .put(updateNoteHandler)
  .delete(deleteNoteHandler);

export { noteRouter };
