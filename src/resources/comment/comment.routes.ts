import { Router } from 'express';

import {
  createNewCommentHandler,
  deleteACommentHandler,
  deleteAllCommentsHandler,
  getAllCommentsHandler,
  getCommentByIdHandler,
  getCommentsByUserHandler,
} from './comment.controller';
import { verifyJWTMiddleware } from '../../middlewares';

const commentRouter = Router();

commentRouter.use(verifyJWTMiddleware);

commentRouter
  .route('/')
  .get(getAllCommentsHandler)
  .delete(deleteAllCommentsHandler)
  .post(createNewCommentHandler);

commentRouter.route('/user/:userId').get(getCommentsByUserHandler);

commentRouter.route('/:commentId').get(getCommentByIdHandler).delete(deleteACommentHandler);

commentRouter.route('/announcement/:announcementId').get(getAllCommentsHandler);

export { commentRouter };
