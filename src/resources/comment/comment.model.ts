import { Schema, Types, model } from 'mongoose';
import type { UserRoles } from '../user';

type CommentSchema = {
  userId: Types.ObjectId;
  username: string;
  roles: UserRoles;

  // id of resource the comment is attached to: announcement, article, etc.
  resourceId: Types.ObjectId;
  // id of parent comment that will be updated
  parentCommentId: Types.ObjectId;
  // children comment ids
  childrenIds: Types.ObjectId[];

  comment: string;
  repliesCount: number;
  likes: number;
  dislikes: number;
  reportsCount: number;

  isFeatured: boolean;
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
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'userId is required'],
      index: true,
    },
    username: {
      type: String,
      required: [true, 'username is required'],
      index: true,
    },
    roles: {
      type: [String],
      required: [true, 'roles is required'],
    },

    resourceId: {
      type: Schema.Types.ObjectId,
      required: [true, 'resourceId is required'],
      ref: 'Announcement',
      index: true,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Comment',
      default: '',
    },
    childrenIds: {
      type: [Schema.Types.ObjectId],
      required: false,
      ref: 'Comment',
      default: [],
    },

    comment: {
      type: String,
      required: [true, 'comment is required'],
    },
    repliesCount: {
      type: Number,
      required: [true, 'repliesCount is required'],
      default: 0,
    },
    likes: {
      type: Number,
      required: [true, 'likes is required'],
      default: 0,
    },
    dislikes: {
      type: Number,
      required: [true, 'dislikes is required'],
      default: 0,
    },
    reportsCount: {
      type: Number,
      required: [true, 'reportsCount is required'],
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      required: [true, 'isFeatured is required'],
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: [true, 'isDeleted is required'],
      default: false,
    },
  },
  { timestamps: true }
);

const CommentModel = model<CommentDocument>('Comment', commentSchema);

export { CommentModel };
export type { CommentDocument, CommentSchema };
