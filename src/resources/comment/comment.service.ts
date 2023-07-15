import { Types } from 'mongoose';

import type { DeleteResult } from 'mongodb';
import type { CommentDocument, CommentSchema } from './comment.model';
import type { DatabaseResponse, DatabaseResponseNullable } from '../../types';

import { CommentModel } from './comment.model';

async function createNewCommentService(commentObj: CommentSchema): Promise<CommentDocument> {
  try {
    const newComment = await CommentModel.create(commentObj);
    return newComment;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewCommentService' });
  }
}

async function getCommentByIdService(
  commentId: string | Types.ObjectId
): DatabaseResponseNullable<CommentDocument> {
  try {
    const comment = await CommentModel.findById(commentId).lean().exec();
    return comment;
  } catch (error: any) {
    throw new Error(error, { cause: 'getCommentByIdService' });
  }
}

async function deleteACommentService(commentId: string): Promise<DeleteResult> {
  try {
    const deleteResult = await CommentModel.deleteOne({ _id: commentId }).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteACommentService' });
  }
}

async function deleteAllCommentsService(): Promise<DeleteResult> {
  try {
    const deleteResult = await CommentModel.deleteMany({}).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllCommentsService' });
  }
}

async function getAllCommentsService(): DatabaseResponse<CommentDocument> {
  try {
    const comments = await CommentModel.find({}).lean().exec();
    return comments;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllCommentsService' });
  }
}

async function getCommentsByUserService(
  userId: Types.ObjectId | string
): DatabaseResponse<CommentDocument> {
  try {
    const comments = await CommentModel.find({ _id: userId }).lean().exec();
    return comments;
  } catch (error: any) {
    throw new Error(error, { cause: 'getCommentsByUserService' });
  }
}

async function getCommentsByAnnouncementIdService(
  announcementId: Types.ObjectId | string
): DatabaseResponse<CommentDocument> {
  try {
    const comments = await CommentModel.find({ _id: announcementId }).lean().exec();
    return comments;
  } catch (error: any) {
    throw new Error(error, { cause: 'getCommentsByAnnouncementIdService' });
  }
}

export {
  createNewCommentService,
  getCommentByIdService,
  deleteACommentService,
  deleteAllCommentsService,
  getAllCommentsService,
  getCommentsByUserService,
  getCommentsByAnnouncementIdService,
};
