import { Types } from 'mongoose';

import type { DeleteResult } from 'mongodb';
import type { CommentDocument, CommentSchema } from './comment.model';
import type {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
} from '../../types';

import { CommentModel } from './comment.model';

async function createNewCommentService(commentObj: CommentSchema): Promise<CommentDocument> {
  try {
    const newComment = await CommentModel.create(commentObj);
    return newComment;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewCommentService' });
  }
}

async function getQueriedCommentsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<CommentDocument>): DatabaseResponse<CommentDocument> {
  try {
    const comments = await CommentModel.find(filter, projection, options).lean().exec();
    return comments;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedCommentsService' });
  }
}

async function getQueriedTotalCommentsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<CommentDocument>): Promise<number> {
  try {
    const totalComments = await CommentModel.countDocuments(filter).lean().exec();
    return totalComments;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalCommentsService' });
  }
}

async function getQueriedCommentsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<CommentDocument>): DatabaseResponse<CommentDocument> {
  try {
    const comments = await CommentModel.find(filter, projection, options).lean().exec();
    return comments;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedCommentsByUserService' });
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

export {
  createNewCommentService,
  getCommentByIdService,
  deleteACommentService,
  deleteAllCommentsService,
  getQueriedCommentsService,
  getQueriedCommentsByUserService,
  getQueriedTotalCommentsService,
};
