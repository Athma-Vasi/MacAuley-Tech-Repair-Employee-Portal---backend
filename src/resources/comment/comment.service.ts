import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { CommentDocument, CommentSchema } from "./comment.model";

import { CommentModel } from "./comment.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../types";

async function getCommentByIdService(
  commentId: Types.ObjectId | string
): DatabaseResponseNullable<CommentDocument> {
  try {
    const comment = await CommentModel.findById(commentId).lean().exec();
    return comment;
  } catch (error: any) {
    throw new Error(error, { cause: "getCommentByIdService" });
  }
}

async function createNewCommentService(
  commentSchema: CommentSchema
): Promise<CommentDocument> {
  try {
    const comment = await CommentModel.create(commentSchema);
    return comment;
  } catch (error: any) {
    throw new Error(error, { cause: "createNewCommentService" });
  }
}

async function getQueriedCommentsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<CommentDocument>): DatabaseResponse<CommentDocument> {
  try {
    const comment = await CommentModel.find(filter, projection, options).lean().exec();
    return comment;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedCommentsService" });
  }
}

async function getQueriedTotalCommentsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<CommentDocument>): Promise<number> {
  try {
    const totalComments = await CommentModel.countDocuments(filter).lean().exec();
    return totalComments;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedTotalCommentsService" });
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
    throw new Error(error, { cause: "getQueriedCommentsByUserService" });
  }
}

async function updateCommentByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<CommentDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const comment = await CommentModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return comment;
  } catch (error: any) {
    throw new Error(error, { cause: "updateCommentStatusByIdService" });
  }
}

async function deleteCommentByIdService(
  commentId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await CommentModel.deleteOne({
      _id: commentId,
    })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteCommentByIdService" });
  }
}

async function deleteAllCommentsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await CommentModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAllCommentsService" });
  }
}

export {
  getCommentByIdService,
  createNewCommentService,
  getQueriedCommentsService,
  getQueriedTotalCommentsService,
  getQueriedCommentsByUserService,
  deleteCommentByIdService,
  deleteAllCommentsService,
  updateCommentByIdService,
};
