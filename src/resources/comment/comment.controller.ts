import expressAsyncHandler from 'express-async-handler';

import type { DeleteResult } from 'mongodb';
import type { Response } from 'express';
import type { CommentDocument, CommentSchema } from './comment.model';
import type {
  CommentServerResponse,
  CreateNewCommentRequest,
  DeleteACommentRequest,
  DeleteAllCommentsRequest,
  GetAllCommentsRequest,
  GetCommentByIdRequest,
  GetCommentsByAnnouncementIdRequest,
  GetCommentsByUserRequest,
} from './comment.types';
import {
  createNewCommentService,
  deleteACommentService,
  deleteAllCommentsService,
  getAllCommentsService,
  getCommentByIdService,
  getCommentsByAnnouncementIdService,
  getCommentsByUserService,
} from './comment.service';

// @desc   Create a new comment
// @route  POST /comments
// @access Private
const createNewCommentHandler = expressAsyncHandler(
  async (request: CreateNewCommentRequest, response: Response<CommentServerResponse>) => {
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
      response.status(400).json({ message: 'Unable to create new comment', commentData: [] });
      return;
    }

    response.status(201).json({ message: 'New comment created', commentData: [newComment] });
  }
);

// @desc   Delete a comment
// @route  DELETE /comments/:commentId
// @access Private
const deleteACommentHandler = expressAsyncHandler(
  async (request: DeleteACommentRequest, response: Response<CommentServerResponse>) => {
    const { commentId } = request.params;

    // delete a comment
    const deleteResult: DeleteResult = await deleteACommentService(commentId);
    if (deleteResult.deletedCount === 0) {
      response.status(400).json({ message: 'Unable to delete comment', commentData: [] });
      return;
    }

    response.status(200).json({ message: 'Comment deleted', commentData: [] });
  }
);

// @desc   Delete all comments
// @route  DELETE /comments
// @access Private
const deleteAllCommentsHandler = expressAsyncHandler(
  async (request: DeleteAllCommentsRequest, response: Response<CommentServerResponse>) => {
    // delete all comments
    const deleteResult: DeleteResult = await deleteAllCommentsService();
    if (deleteResult.deletedCount === 0) {
      response.status(400).json({ message: 'Unable to delete all comments', commentData: [] });
      return;
    }

    response.status(200).json({ message: 'All comments deleted', commentData: [] });
  }
);

// @desc   Get all comments
// @route  GET /comments
// @access Private
const getAllCommentsHandler = expressAsyncHandler(
  async (request: GetAllCommentsRequest, response: Response<CommentServerResponse>) => {
    // get all comments
    const allComments = await getAllCommentsService();
    if (allComments.length === 0) {
      response.status(400).json({ message: 'Unable to get all comments', commentData: [] });
      return;
    }

    response.status(200).json({ message: 'All comments retrieved', commentData: allComments });
  }
);

// @desc   Get all comments by user
// @route  GET /comments/user/:userId
// @access Private
const getCommentsByUserHandler = expressAsyncHandler(
  async (request: GetCommentsByUserRequest, response: Response<CommentServerResponse>) => {
    const { userId } = request.params;

    // get all comments by user
    const allCommentsByUser = await getCommentsByUserService(userId);
    if (allCommentsByUser.length === 0) {
      response.status(400).json({ message: 'Unable to get all comments by user', commentData: [] });
      return;
    }

    response
      .status(200)
      .json({ message: 'All comments by user retrieved', commentData: allCommentsByUser });
  }
);

// @desc   Get a comment by id
// @route  GET /comments/:commentId
// @access Private
const getCommentByIdHandler = expressAsyncHandler(
  async (request: GetCommentByIdRequest, response: Response<CommentServerResponse>) => {
    const { commentId } = request.params;

    // get a comment by id
    const commentById = await getCommentByIdService(commentId);
    if (!commentById) {
      response.status(400).json({ message: 'Unable to get comment by id', commentData: [] });
      return;
    }

    response.status(200).json({ message: 'Comment by id retrieved', commentData: [commentById] });
  }
);

// @desc   get all comments by announcement id
// @route  GET /comments/announcement/:announcementId
// @access Private
const getCommentsByAnnouncementIdHandler = expressAsyncHandler(
  async (
    request: GetCommentsByAnnouncementIdRequest,
    response: Response<CommentServerResponse>
  ) => {
    const { announcementId } = request.params;

    // get all comments by announcement id
    const allCommentsByAnnouncementId = await getCommentsByAnnouncementIdService(announcementId);
    if (allCommentsByAnnouncementId.length === 0) {
      response
        .status(400)
        .json({ message: 'Unable to get all comments by announcement id', commentData: [] });
      return;
    }

    response.status(200).json({
      message: 'All comments by announcement id retrieved',
      commentData: allCommentsByAnnouncementId,
    });
  }
);

export {
  createNewCommentHandler,
  deleteACommentHandler,
  deleteAllCommentsHandler,
  getAllCommentsHandler,
  getCommentsByUserHandler,
  getCommentByIdHandler,
};
