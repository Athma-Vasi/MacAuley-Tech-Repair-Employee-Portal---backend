import { Router } from 'express';

import {
  createNewCommentHandler,
  deleteACommentHandler,
  deleteAllCommentsHandler,
  getQueriedCommentsHandler,
  getCommentByIdHandler,
  getQueriedCommentsByUserHandler,
} from './comment.controller';
import { assignQueryDefaults, verifyJWTMiddleware, verifyRoles } from '../../middlewares';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../constants';

const commentRouter = Router();

commentRouter.use(verifyJWTMiddleware);
commentRouter.use(verifyRoles());

commentRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedCommentsHandler)
  .delete(deleteAllCommentsHandler)
  .post(createNewCommentHandler);

commentRouter
  .route('/user')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedCommentsByUserHandler);

commentRouter.route('/:commentId').get(getCommentByIdHandler).delete(deleteACommentHandler);

commentRouter
  .route('/announcement/:announcementId')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedCommentsHandler);

export { commentRouter };
