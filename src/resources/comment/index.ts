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
  getAllCommentsHandler,
  getCommentByIdHandler,
  getCommentsByUserHandler,
} from './comment.controller';
import {
  createNewCommentService,
  deleteACommentService,
  deleteAllCommentsService,
  getAllCommentsService,
  getCommentByIdService,
  getCommentsByUserService,
} from './comment.service';

import type { CommentDocument, CommentSchema } from './comment.model';
import type {
  CreateNewCommentRequest,
  DeleteACommentRequest,
  DeleteAllCommentsRequest,
  GetAllCommentsRequest,
  GetCommentByIdRequest,
  GetCommentsByAnnouncementIdRequest,
  GetCommentsByUserRequest,
  CommentServerResponse,
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
  getAllCommentsHandler,
  getCommentByIdHandler,
  getCommentsByUserHandler,
  createNewCommentService,
  deleteACommentService,
  deleteAllCommentsService,
  getAllCommentsService,
  getCommentByIdService,
  getCommentsByUserService,
};

export type {
  CommentDocument,
  CommentSchema,
  CreateNewCommentRequest,
  DeleteACommentRequest,
  DeleteAllCommentsRequest,
  GetAllCommentsRequest,
  GetCommentByIdRequest,
  GetCommentsByAnnouncementIdRequest,
  GetCommentsByUserRequest,
  CommentServerResponse,
};
