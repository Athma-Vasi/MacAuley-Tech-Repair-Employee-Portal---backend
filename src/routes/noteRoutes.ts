import { Router } from 'express';

import { verifyJWTMiddleware } from '../middlewares';
import {
  createNewNoteHandler,
  deleteNoteHandler,
  getAllNotesHandler,
  updateNoteHandler,
} from '../controllers';

const noteRouter = Router();

// verifyJWT middleware is applied to all routes in this router
noteRouter.use(verifyJWTMiddleware);

noteRouter
  .route('/')
  .get(getAllNotesHandler)
  .post(createNewNoteHandler)
  .patch(updateNoteHandler)
  .delete(deleteNoteHandler);

noteRouter.route('/:userId').get(getNotesFromUserIdHandler);
export { noteRouter };
