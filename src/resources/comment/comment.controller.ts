import expressAsyncHandler from 'express-async-handler';

import type { DeleteResult } from 'mongodb';
import type { Response } from 'express';
import type { CommentDocument, CommentSchema } from './comment.model';
import type {
  CreateNewCommentRequest,
  DeleteACommentRequest,
  DeleteAllCommentsRequest,
  GetQueriedCommentsRequest,
  GetCommentByIdRequest,
  GetQueriedCommentsByUserRequest,
  GetQueriedCommentsByParentResourceIdRequest,
  UpdateCommentByIdRequest,
} from './comment.types';
import {
  createNewCommentService,
  deleteACommentService,
  deleteAllCommentsService,
  getQueriedCommentsService,
  getCommentByIdService,
  getQueriedCommentsByUserService,
  getQueriedTotalCommentsService,
  updateCommentByIdService,
} from './comment.service';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../types';
import { FilterQuery, QueryOptions } from 'mongoose';

// @desc   Create a new comment
// @route  POST /comment
// @access Private
const createNewCommentHandler = expressAsyncHandler(
  async (
    request: CreateNewCommentRequest,
    response: Response<ResourceRequestServerResponse<CommentDocument>>
  ) => {
    const {
      userInfo: { userId, username, roles },
      comment: {
        comment,
        department,
        jobPosition,
        profilePictureUrl,
        quotedComment,
        quotedUsername,
        dislikesCount,
        isDeleted,
        isFeatured,
        likesCount,
        parentResourceId,
        reportsCount,
        dislikedUserIds,
        likedUserIds,
        reportedUserIds,
      },
    } = request.body;

    // create new comment object
    const newCommentObject: CommentSchema = {
      userId,
      username,
      roles,

      department,
      jobPosition,
      profilePictureUrl,
      comment,
      quotedUsername,
      quotedComment,
      dislikesCount,
      isDeleted,
      isFeatured,
      likesCount,
      parentResourceId,
      reportsCount,
      dislikedUserIds,
      likedUserIds,
      reportedUserIds,
    };

    // create new comment
    const newComment = await createNewCommentService(newCommentObject);
    if (!newComment) {
      response.status(400).json({ message: 'Unable to create new comment', resourceData: [] });
      return;
    }

    response
      .status(201)
      .json({ message: 'Successfully created comment!', resourceData: [newComment] });
  }
);

// @desc   Get all comments
// @route  GET /comment
// @access Private
const getQueriedCommentsHandler = expressAsyncHandler(
  async (
    request: GetQueriedCommentsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<CommentDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalCommentsService({
        filter: filter as FilterQuery<CommentDocument> | undefined,
      });
    }

    // get all comments
    const comments = await getQueriedCommentsService({
      filter: filter as FilterQuery<CommentDocument> | undefined,
      projection: projection as QueryOptions<CommentDocument>,
      options: options as QueryOptions<CommentDocument>,
    });
    if (comments.length === 0) {
      response.status(200).json({
        message: 'No comments that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found comments',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: comments.length,
        resourceData: comments,
      });
    }
  }
);

// @desc   Get all comments by user
// @route  GET /comment/user
// @access Private
const getQueriedCommentsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedCommentsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<CommentDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // assign userId to filter
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
    if (comments.length === 0) {
      response.status(200).json({
        message: 'No comments found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Comments found successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: comments.length,
        resourceData: comments,
      });
    }
  }
);

// @desc   Get all comments by parent resource id
// @route  GET /comment/parentResource/:parentResourceId
// @access Private
const getQueriedCommentsByParentResourceIdHandler = expressAsyncHandler(
  async (
    request: GetQueriedCommentsByParentResourceIdRequest,
    response: Response<GetQueriedResourceRequestServerResponse<CommentDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;
    const { parentResourceId } = request.params;

    let { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // add parentResourceId to filter
    filter = { ...filter, parentResourceId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalCommentsService({
        filter: filter as FilterQuery<CommentDocument> | undefined,
      });
    }

    // get all comments
    const comments = await getQueriedCommentsService({
      filter: filter as FilterQuery<CommentDocument> | undefined,
      projection: projection as QueryOptions<CommentDocument>,
      options: options as QueryOptions<CommentDocument>,
    });
    if (comments.length === 0) {
      response.status(200).json({
        message: 'No comments that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found comments',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: comments.length,
        resourceData: comments,
      });
    }
  }
);

// @desc   Get a comment by id
// @route  GET /comment/:commentId
// @access Private
const getCommentByIdHandler = expressAsyncHandler(
  async (
    request: GetCommentByIdRequest,
    response: Response<ResourceRequestServerResponse<CommentDocument>>
  ) => {
    const { commentId } = request.params;

    // get a comment by id
    const commentById = await getCommentByIdService(commentId);
    if (!commentById) {
      response.status(400).json({ message: 'Unable to get comment by id', resourceData: [] });
      return;
    }

    response
      .status(200)
      .json({ message: 'Successfully retrieved comment!', resourceData: [commentById] });
  }
);

// @desc   Update a comment by id
// @route  PATCH /comment/:commentId
// @access Private
const updateCommentByIdHandler = expressAsyncHandler(
  async (
    request: UpdateCommentByIdRequest,
    response: Response<ResourceRequestServerResponse<CommentDocument>>
  ) => {
    const { commentId } = request.params;
    const {
      userInfo: { userId },
      fieldsToUpdate,
    } = request.body;

    // check if comment exists
    const commentById = await getCommentByIdService(commentId);
    if (!commentById) {
      response.status(400).json({ message: 'Unable to get comment by id', resourceData: [] });
      return;
    }

    // update comment
    const updatedComment = await updateCommentByIdService({
      commentId,
      fieldsToUpdate: { ...fieldsToUpdate, userId },
    });

    if (!updatedComment) {
      response.status(400).json({ message: 'Unable to update comment', resourceData: [] });
      return;
    }

    response
      .status(200)
      .json({ message: 'Successfully updated comment!', resourceData: [updatedComment] });
  }
);

// @desc   Delete a comment
// @route  DELETE /comment/:commentId
// @access Private
const deleteACommentHandler = expressAsyncHandler(
  async (
    request: DeleteACommentRequest,
    response: Response<ResourceRequestServerResponse<CommentDocument>>
  ) => {
    const { commentId } = request.params;

    // delete a comment
    const deleteResult: DeleteResult = await deleteACommentService(commentId);
    if (deleteResult.deletedCount === 0) {
      response.status(400).json({ message: 'Unable to delete comment', resourceData: [] });
      return;
    }

    response.status(200).json({ message: 'Comment deleted', resourceData: [] });
  }
);

// @desc   Delete all comments
// @route  DELETE /comment
// @access Private
const deleteAllCommentsHandler = expressAsyncHandler(
  async (
    _request: DeleteAllCommentsRequest,
    response: Response<ResourceRequestServerResponse<CommentDocument>>
  ) => {
    // delete all comments
    const deleteResult: DeleteResult = await deleteAllCommentsService();
    if (deleteResult.deletedCount === 0) {
      response.status(400).json({ message: 'Unable to delete all comments', resourceData: [] });
      return;
    }

    response.status(200).json({ message: 'All comments deleted', resourceData: [] });
  }
);

export {
  createNewCommentHandler,
  deleteACommentHandler,
  deleteAllCommentsHandler,
  getQueriedCommentsByParentResourceIdHandler,
  getQueriedCommentsHandler,
  getQueriedCommentsByUserHandler,
  updateCommentByIdHandler,
  getCommentByIdHandler,
};
