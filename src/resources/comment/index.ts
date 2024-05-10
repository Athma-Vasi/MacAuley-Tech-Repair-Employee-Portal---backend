/**
 * This barrel index file is used to import/export comment model, router, types, handlers and services
 */

/**
 * Imports
 */

import { CommentModel } from "./comment.model";
import { commentRouter } from "./comment.routes";
import {
  createNewCommentController,
  createNewCommentsBulkController,
  deleteAllCommentsController,
  deleteCommentController,
  getCommentByIdController,
  getCommentsByUserController,
  getQueriedCommentsByParentResourceIdController,
  getQueriedCommentsController,
  updateCommentByIdController,
  updateCommentsBulkController,
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
  createNewCommentController,
  createNewCommentService,
  createNewCommentsBulkController,
  deleteAllCommentsController,
  deleteAllCommentsService,
  deleteCommentController,
  deleteCommentByIdService,
  getCommentByIdController,
  getCommentByIdService,
  getCommentsByUserController,
  getQueriedCommentsByParentResourceIdController,
  getQueriedCommentsByUserService,
  getQueriedCommentsController,
  getQueriedCommentsService,
  getQueriedTotalCommentsService,
  updateCommentByIdService,
  updateCommentByIdController,
  updateCommentsBulkController,
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
