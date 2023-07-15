import { Schema, Types, model } from 'mongoose';
import type { UserRoles } from '../user';

type CommentSchema = {
  creatorId: Types.ObjectId;
  creatorUsername: string;
  creatorRole: UserRoles[];
  parentCommentId: Types.ObjectId;

  comment: string;
  isAnonymous: boolean;
  isDeleted: boolean;
};

type CommentDocument = CommentSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const commentSchema = new Schema<CommentSchema>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      required: [true, 'creatorID (userId) is required'],
      index: true,
    },
    creatorUsername: {
      type: String,
      required: [true, 'creatorUsername is required'],
      index: true,
    },
    creatorRole: {
      type: [String],
      required: [true, 'creatorRole is required'],
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      required: [true, 'parentCommentId is required'],
      index: true,
    },

    comment: {
      type: String,
      required: [true, 'comment is required'],
    },
    isAnonymous: {
      type: Boolean,
      required: [true, 'isAnonymous is required'],
    },
    isDeleted: {
      type: Boolean,
      required: [true, 'isDeleted is required'],
    },
  },
  { timestamps: true }
);

const CommentModel = model<CommentSchema>('Comment', commentSchema);

export { CommentModel };
export type { CommentDocument, CommentSchema };
