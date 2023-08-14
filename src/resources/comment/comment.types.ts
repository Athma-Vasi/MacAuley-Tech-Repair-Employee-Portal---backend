import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../auth';
import type { UserRoles } from '../user';
import { GetQueriedResourceRequest, QueryObjectParsed } from '../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface CreateNewCommentRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    comment: {
      // id of resource the comment is attached to: announcement, article, etc.
      resourceId: Types.ObjectId;
      // id of parent comment that will be updated
      parentCommentId: Types.ObjectId;
      // children comment ids
      childrenIds: Types.ObjectId[];

      comment: string;
      repliesCount: number;
      likesCount: number;
      dislikesCount: number;
      reportsCount: number;
      isFeatured: boolean;
      isDeleted: boolean;
    };
  };
}

interface DeleteACommentRequest extends RequestAfterJWTVerification {
  params: {
    commentId: string;
  };
}

type DeleteAllCommentsRequest = RequestAfterJWTVerification;

type GetQueriedCommentsRequest = GetQueriedResourceRequest;

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

export type {
  CreateNewCommentRequest,
  DeleteACommentRequest,
  DeleteAllCommentsRequest,
  GetQueriedCommentsRequest,
  GetQueriedCommentsByUserRequest,
  GetCommentByIdRequest,
};
