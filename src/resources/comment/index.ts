/**
 * This barrel index file is used to import/export comment model, router, types, handlers and services
 */

/**
 * Imports
 */

import { CommentModel } from "./comment.model";
import { commentRouter } from "./comment.routes";
import {
  createNewCommentHandler,
  createNewCommentsBulkHandler,
  deleteAllCommentsHandler,
  deleteCommentHandler,
  getCommentByIdHandler,
  getCommentsByUserHandler,
  getQueriedCommentsByParentResourceIdHandler,
  getQueriedCommentsHandler,
  updateCommentByIdHandler,
  updateCommentsBulkHandler,
} from "./comment.controller";
import {
  createNewCommentService,
  deleteAllCommentsService,
  deleteCommentByIdService,
  getCommentByIdService,
  getQueriedCommentsByUserService,
  getQueriedCommentsService,
  getQueriedTotalCommentsService,
  updateCommentByIdService,
} from "./comment.service";

import type { CommentDocument, CommentSchema } from "./comment.model";
import type {
  CreateNewCommentRequest,
  CreateNewCommentsBulkRequest,
  DeleteAllCommentsRequest,
  DeleteCommentRequest,
  GetCommentByIdRequest,
  GetQueriedCommentsByParentResourceIdRequest,
  GetQueriedCommentsByUserRequest,
  GetQueriedCommentsRequest,
  UpdateCommentByIdRequest,
  UpdateCommentsBulkRequest,
} from "./comment.types";

/**
 * Exports
 */

export {
  CommentModel,
  commentRouter,
  createNewCommentHandler,
  createNewCommentService,
  createNewCommentsBulkHandler,
  deleteAllCommentsHandler,
  deleteAllCommentsService,
  deleteCommentHandler,
  deleteCommentByIdService,
  getCommentByIdHandler,
  getCommentByIdService,
  getCommentsByUserHandler,
  getQueriedCommentsByParentResourceIdHandler,
  getQueriedCommentsByUserService,
  getQueriedCommentsHandler,
  getQueriedCommentsService,
  getQueriedTotalCommentsService,
  updateCommentByIdService,
  updateCommentByIdHandler,
  updateCommentsBulkHandler,
};

export type {
  CommentDocument,
  CommentSchema,
  CreateNewCommentRequest,
  CreateNewCommentsBulkRequest,
  DeleteAllCommentsRequest,
  DeleteCommentRequest,
  GetCommentByIdRequest,
  GetQueriedCommentsByParentResourceIdRequest,
  GetQueriedCommentsByUserRequest,
  GetQueriedCommentsRequest,
  UpdateCommentByIdRequest,
  UpdateCommentsBulkRequest,
};
