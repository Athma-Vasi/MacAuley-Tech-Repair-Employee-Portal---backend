import { Schema, Types, model } from 'mongoose';
import type { Department, JobPosition, UserRoles } from '../user';

type CommentSchema = {
  userId: Types.ObjectId;
  username: string;
  roles: UserRoles;

  jobPosition: JobPosition;
  department: Department;
  profilePictureUrl: string;
  parentResourceId: Types.ObjectId;
  comment: string;
  quotedUsername: string;
  quotedComment: string;
  likesCount: number;
  dislikesCount: number;
  reportsCount: number;

  isFeatured: boolean;
  isDeleted: boolean;

  likedUserIds: Types.ObjectId[];
  dislikedUserIds: Types.ObjectId[];
  reportedUserIds: Types.ObjectId[];
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

    parentResourceId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    comment: {
      type: String,
      required: [true, 'comment is required'],
    },
    quotedUsername: {
      type: String,
      required: false,
      default: '',
    },
    quotedComment: {
      type: String,
      required: false,
      default: '',
    },

    likesCount: {
      type: Number,
      required: [true, 'likesCount is required'],
      default: 0,
    },
    dislikesCount: {
      type: Number,
      required: [true, 'dislikesCount is required'],
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

    likedUserIds: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: [],
    },
    dislikedUserIds: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: [],
    },
    reportedUserIds: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: [],
    },
  },
  { timestamps: true }
);

const CommentModel = model<CommentDocument>('Comment', commentSchema);

export { CommentModel };
export type { CommentDocument, CommentSchema };
