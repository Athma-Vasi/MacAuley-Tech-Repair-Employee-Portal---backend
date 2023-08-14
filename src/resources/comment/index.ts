/**
 * This barrel index file is used to import/export comment model, router, types, handlers and services
 */

/**
 * Imports
 */

import { CommentModel } from './comment.model';
import { commentRouter } from './comment.routes';
import {
  createNewCommentHandler,
  deleteACommentHandler,
  deleteAllCommentsHandler,
  getQueriedCommentsHandler,
  getCommentByIdHandler,
  getQueriedCommentsByUserHandler,
} from './comment.controller';
import {
  createNewCommentService,
  deleteACommentService,
  deleteAllCommentsService,
  getQueriedCommentsService,
  getCommentByIdService,
  getQueriedCommentsByUserService,
} from './comment.service';

import type { CommentDocument, CommentSchema } from './comment.model';
import type {
  CreateNewCommentRequest,
  DeleteACommentRequest,
  DeleteAllCommentsRequest,
  GetQueriedCommentsRequest,
  GetCommentByIdRequest,
  GetQueriedCommentsByUserRequest,
} from './comment.types';

/**
 * Exports
 */

export {
  CommentModel,
  commentRouter,
  createNewCommentHandler,
  deleteACommentHandler,
  deleteAllCommentsHandler,
  getQueriedCommentsHandler,
  getCommentByIdHandler,
  getQueriedCommentsByUserHandler,
  createNewCommentService,
  deleteACommentService,
  deleteAllCommentsService,
  getQueriedCommentsService,
  getCommentByIdService,
  getQueriedCommentsByUserService,
};

export type {
  CommentDocument,
  CommentSchema,
  CreateNewCommentRequest,
  DeleteACommentRequest,
  DeleteAllCommentsRequest,
  GetQueriedCommentsRequest,
  GetCommentByIdRequest,
  GetQueriedCommentsByUserRequest,
};
