import { Router } from 'express';

import {
  createNewCommentHandler,
  deleteACommentHandler,
  deleteAllCommentsHandler,
  getQueriedCommentsHandler,
  getCommentByIdHandler,
  getQueriedCommentsByUserHandler,
  getQueriedCommentsByParentResourceIdHandler,
  updateCommentByIdHandler,
  createNewCommentsBulkHandler,
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

// DEV ROUTE
commentRouter.route('/dev').post(createNewCommentsBulkHandler);

commentRouter
  .route('/parentResource/:parentResourceId')
  .get(
    assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS),
    getQueriedCommentsByParentResourceIdHandler
  );

commentRouter
  .route('/:commentId')
  .get(getCommentByIdHandler)
  .delete(deleteACommentHandler)
  .patch(updateCommentByIdHandler);

export { commentRouter };
