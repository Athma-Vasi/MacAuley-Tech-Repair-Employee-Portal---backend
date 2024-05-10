import expressAsyncController from "express-async-handler";

import type { DeleteResult } from "mongodb";
import type { NextFunction, Response } from "express";
import type { CommentDocument } from "./comment.model";
import type {
  CreateNewCommentRequest,
  DeleteAllCommentsRequest,
  GetQueriedCommentsRequest,
  GetCommentByIdRequest,
  GetQueriedCommentsByUserRequest,
  GetQueriedCommentsByParentResourceIdRequest,
  UpdateCommentByIdRequest,
  CreateNewCommentsBulkRequest,
  DeleteCommentRequest,
  UpdateCommentsBulkRequest,
} from "./comment.types";
import {
  createNewCommentService,
  deleteAllCommentsService,
  getQueriedCommentsService,
  getCommentByIdService,
  getQueriedCommentsByUserService,
  getQueriedTotalCommentsService,
  updateCommentByIdService,
  deleteCommentByIdService,
} from "./comment.service";
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../types";
import { FilterQuery, QueryOptions } from "mongoose";

import { removeUndefinedAndNullValues } from "../../utils";
import { getUserByIdService } from "../user";
import createHttpError from "http-errors";

// @desc   Create a new comment
// @route  POST api/v1/actions/general/comment
// @access Private
const createNewCommentController = expressAsyncController(
  async (
    request: CreateNewCommentRequest,
    response: Response<ResourceRequestServerResponse<CommentDocument>>,
    next: NextFunction
  ) => {
    const { commentSchema } = request.body;

    const commentDocument = await createNewCommentService(commentSchema);
    if (!commentDocument) {
      return next(new createHttpError.InternalServerError("createNewCommentService"));
    }

    response.status(201).json({
      message: "Successfully created comment",
      resourceData: [commentDocument],
    });
  }
);

// @desc   Get all comments
// @route  GET api/v1/actions/general/comment
// @access Private/Admin/Manager
const getQueriedCommentsController = expressAsyncController(
  async (
    request: GetQueriedCommentsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<CommentDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalCommentsService({
        filter: filter as FilterQuery<CommentDocument> | undefined,
      });
    }

    const comment = await getQueriedCommentsService({
      filter: filter as FilterQuery<CommentDocument> | undefined,
      projection: projection as QueryOptions<CommentDocument>,
      options: options as QueryOptions<CommentDocument>,
    });

    if (!comment.length) {
      response.status(200).json({
        message: "No comments that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Comments found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: comment,
    });
  }
);

// @desc   Get all comment by user
// @route  GET api/v1/actions/general/comment
// @access Private
const getCommentsByUserController = expressAsyncController(
  async (
    request: GetQueriedCommentsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<CommentDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalCommentsService({
        filter: filterWithUserId,
      });
    }

    const comments = await getQueriedCommentsByUserService({
      filter: filterWithUserId as FilterQuery<CommentDocument> | undefined,
      projection: projection as QueryOptions<CommentDocument>,
      options: options as QueryOptions<CommentDocument>,
    });

    if (!comments.length) {
      response.status(200).json({
        message: "No comment found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Comment found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: comments,
    });
  }
);

// @desc   Update comment status
// @route  PATCH api/v1/actions/general/comment
// @access Private/Admin/Manager
const updateCommentByIdController = expressAsyncController(
  async (
    request: UpdateCommentByIdRequest,
    response: Response<ResourceRequestServerResponse<CommentDocument>>,
    next: NextFunction
  ) => {
    const { commentId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      return next(new createHttpError.NotFound("User not found"));
    }

    const updatedComment = await updateCommentByIdService({
      _id: commentId,
      fields,
      updateOperator,
    });

    if (!updatedComment) {
      return next(new createHttpError.InternalServerError("Comment not updated"));
    }

    response.status(200).json({
      message: "Comment status updated successfully",
      resourceData: [updatedComment],
    });
  }
);

// @desc   Get all comments by parent resource id
// @route  GET /comment/parentResource/:parentResourceId
// @access Private
const getQueriedCommentsByParentResourceIdController = expressAsyncController(
  async (
    request: GetQueriedCommentsByParentResourceIdRequest,
    response: Response<GetQueriedResourceRequestServerResponse<CommentDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;
    const { parentResourceId } = request.params;

    let { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    filter = { ...filter, parentResourceId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalCommentsService({
        filter: filter as FilterQuery<CommentDocument> | undefined,
      });
    }

    const comments = await getQueriedCommentsService({
      filter: filter as FilterQuery<CommentDocument> | undefined,
      projection: projection as QueryOptions<CommentDocument>,
      options: options as QueryOptions<CommentDocument>,
    });

    if (!comments.length) {
      response.status(200).json({
        message: "No comments that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully found comments",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: comments,
    });
  }
);

// @desc   Get a comment request
// @route  GET api/v1/actions/general/comment
// @access Private
const getCommentByIdController = expressAsyncController(
  async (
    request: GetCommentByIdRequest,
    response: Response<ResourceRequestServerResponse<CommentDocument>>,
    next: NextFunction
  ) => {
    const { commentId } = request.params;
    const comment = await getCommentByIdService(commentId);
    if (!comment) {
      return next(new createHttpError.NotFound("Comment not found"));
    }

    response.status(200).json({
      message: "Comment found successfully",
      resourceData: [comment],
    });
  }
);

// @desc   Delete a comment by its id
// @route  DELETE api/v1/actions/general/comment
// @access Private
const deleteCommentController = expressAsyncController(
  async (request: DeleteCommentRequest, response: Response, next: NextFunction) => {
    const { commentId } = request.params;

    const deletedResult: DeleteResult = await deleteCommentByIdService(commentId);
    if (!deletedResult.deletedCount) {
      return next(new createHttpError.InternalServerError("Comment not deleted"));
    }

    response.status(200).json({
      message: "Comment deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all comment
// @route   DELETE api/v1/actions/general/request-resource/comment
// @access  Private
const deleteAllCommentsController = expressAsyncController(
  async (_request: DeleteAllCommentsRequest, response: Response, next: NextFunction) => {
    const deletedResult: DeleteResult = await deleteAllCommentsService();
    if (!deletedResult.deletedCount) {
      return next(new createHttpError.InternalServerError("Comment not deleted"));
    }

    response.status(200).json({
      message: "All comments deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new comments in bulk
// @route  POST api/v1/actions/general/comment
// @access Private
const createNewCommentsBulkController = expressAsyncController(
  async (
    request: CreateNewCommentsBulkRequest,
    response: Response<ResourceRequestServerResponse<CommentDocument>>
  ) => {
    const { commentSchemas } = request.body;

    const commentDocuments = await Promise.all(
      commentSchemas.map(async (commentSchema) => {
        const commentDocument = await createNewCommentService(commentSchema);
        return commentDocument;
      })
    );

    const filteredCommentDocuments = commentDocuments.filter(
      removeUndefinedAndNullValues
    );

    if (filteredCommentDocuments.length === 0) {
      response.status(400).json({
        message: "Comment creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount =
      commentSchemas.length - filteredCommentDocuments.length;

    response.status(201).json({
      message: `Successfully created ${filteredCommentDocuments.length} Comment.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredCommentDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update Comments in bulk
// @route  PATCH api/v1/actions/general/comment
// @access Private
const updateCommentsBulkController = expressAsyncController(
  async (
    request: UpdateCommentsBulkRequest,
    response: Response<ResourceRequestServerResponse<CommentDocument>>
  ) => {
    const { commentFields } = request.body;

    const updatedComments = await Promise.all(
      commentFields.map(async (commentField) => {
        const {
          documentUpdate: { fields, updateOperator },
          commentId,
        } = commentField;

        const updatedComment = await updateCommentByIdService({
          _id: commentId,
          fields,
          updateOperator,
        });

        return updatedComment;
      })
    );

    const successfullyCreatedComments = updatedComments.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedComments.length === 0) {
      response.status(400).json({
        message: "Could not create any Comments",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${successfullyCreatedComments.length} Comments. ${
        commentFields.length - successfullyCreatedComments.length
      } Comments failed to be created.`,
      resourceData: successfullyCreatedComments,
    });
  }
);

export {
  createNewCommentController,
  getQueriedCommentsController,
  getCommentsByUserController,
  updateCommentByIdController,
  getQueriedCommentsByParentResourceIdController,
  getCommentByIdController,
  deleteCommentController,
  deleteAllCommentsController,
  createNewCommentsBulkController,
  updateCommentsBulkController,
};
