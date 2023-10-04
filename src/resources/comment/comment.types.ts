import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../auth';
import type { Department, JobPosition, UserRoles } from '../user';
import { GetQueriedResourceRequest } from '../../types';
import { CommentDocument } from './comment.model';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface CreateNewCommentRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    comment: {
      firstName: string;
      middleName: string;
      lastName: string;
      department: Department;
      jobPosition: JobPosition;
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
  };
}

// DEV ROUTE
interface CreateNewCommentsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    comments: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
      firstName: string;
      middleName: string;
      lastName: string;
      department: Department;
      jobPosition: JobPosition;
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
    }[];
  };
}

interface DeleteACommentRequest extends RequestAfterJWTVerification {
  params: {
    commentId: string;
  };
}

type DeleteAllCommentsRequest = RequestAfterJWTVerification;

type GetQueriedCommentsRequest = GetQueriedResourceRequest;

type GetQueriedCommentsByParentResourceIdRequest = GetQueriedResourceRequest;

type GetQueriedCommentsByUserRequest = GetQueriedResourceRequest;

interface GetCommentByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { commentId: string };
}

interface UpdateCommentByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    fieldsToUpdate: Partial<CommentDocument>;
  };
  params: { commentId: string };
}

export type {
  CreateNewCommentRequest,
  CreateNewCommentsBulkRequest,
  DeleteACommentRequest,
  DeleteAllCommentsRequest,
  GetQueriedCommentsRequest,
  GetQueriedCommentsByUserRequest,
  GetQueriedCommentsByParentResourceIdRequest,
  UpdateCommentByIdRequest,
  GetCommentByIdRequest,
};
