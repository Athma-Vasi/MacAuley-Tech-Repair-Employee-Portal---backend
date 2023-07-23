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
  GetCommentsByAnnouncementIdRequest,
  GetQueriedCommentsByUserRequest,
} from './comment.types';
import {
  createNewCommentService,
  deleteACommentService,
  deleteAllCommentsService,
  getQueriedCommentsService,
  getCommentByIdService,
  getQueriedCommentsByAnnouncementIdService,
  getQueriedCommentsByUserService,
  getQueriedTotalCommentsService,
} from './comment.service';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../types';
import { FilterQuery, QueryOptions } from 'mongoose';

// @desc   Create a new comment
// @route  POST /comments
// @access Private
const createNewCommentHandler = expressAsyncHandler(
  async (
    request: CreateNewCommentRequest,
    response: Response<ResourceRequestServerResponse<CommentDocument>>
  ) => {
    const {
      userInfo: { userId, username, roles },
      comment: { announcementId, parentCommentId, comment, isAnonymous, isDeleted },
    } = request.body;

    // create new comment object
    const newCommentObject: CommentSchema = {
      creatorId: userId,
      creatorUsername: username,
      creatorRole: roles,

      announcementId,
      parentCommentId,
      comment,
      isAnonymous,
      isDeleted,
    };

    // create new comment
    const newComment = await createNewCommentService(newCommentObject);
    if (!newComment) {
      response.status(400).json({ message: 'Unable to create new comment', resourceData: [] });
      return;
    }

    response.status(201).json({ message: 'New comment created', resourceData: [newComment] });
  }
);

// @desc   Get all comments
// @route  GET /comments
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
      response.status(404).json({
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
// @route  GET /comments/user
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
      response.status(404).json({
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

// @desc   get all comments by announcement id
// @route  GET /comments/announcement/:announcementId
// @access Private
const getQueriedCommentsByAnnouncementIdHandler = expressAsyncHandler(
  async (
    request: GetCommentsByAnnouncementIdRequest,
    response: Response<GetQueriedResourceRequestServerResponse<CommentDocument>>
  ) => {
    const { announcementId } = request.params;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // assign announcementId to filter
    const filterWithAnnouncementId = { ...filter, announcementId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalCommentsService({
        filter: filterWithAnnouncementId,
      });
    }

    const comments = await getQueriedCommentsByUserService({
      filter: filterWithAnnouncementId as FilterQuery<CommentDocument> | undefined,
      projection: projection as QueryOptions<CommentDocument>,
      options: options as QueryOptions<CommentDocument>,
    });
    if (comments.length === 0) {
      response.status(404).json({
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

// @desc   Get a comment by id
// @route  GET /comments/:commentId
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

    response.status(200).json({ message: 'Comment by id retrieved', resourceData: [commentById] });
  }
);

// @desc   Delete a comment
// @route  DELETE /comments/:commentId
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
// @route  DELETE /comments
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
  getQueriedCommentsHandler,
  getQueriedCommentsByUserHandler,
  getCommentByIdHandler,
};
