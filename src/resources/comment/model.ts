import { Schema, Types, model } from 'mongoose';
import type { Department, JobPosition, UserRoles } from '../user';

type CommentSchema = {
  userId: Types.ObjectId;
  username: string;
  roles: UserRoles;

  firstName: string;
  middleName: string;
  lastName: string;
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
    },
    roles: {
      type: [String],
      required: [true, 'roles is required'],
      index: true,
    },

    firstName: {
      type: String,
      required: [true, 'firstName is required'],
    },
    middleName: {
      type: String,
      required: false,
      default: '',
    },
    lastName: {
      type: String,
      required: [true, 'lastName is required'],
    },
    jobPosition: {
      type: String,
      required: [true, 'jobPosition is required'],
      index: true,
    },
    department: {
      type: String,
      required: [true, 'department is required'],
      index: true,
    },
    profilePictureUrl: {
      type: String,
      required: [true, 'profilePictureUrl is required'],
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
      index: true,
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

// text index for searching
commentSchema.index({
  username: 'text',
  firstName: 'text',
  middleName: 'text',
  lastName: 'text',
  comment: 'text',
  profilePictureUrl: 'text',
  quotedUsername: 'text',
  quotedComment: 'text',
});

const CommentModel = model<CommentDocument>('Comment', commentSchema);

export { CommentModel };
export type { CommentDocument, CommentSchema };
