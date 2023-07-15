import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../auth';
import type { CommentDocument, CommentSchema } from './comment.model';
import type { UserRoles } from '../user';

import { CommentModel } from './comment.model';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface CreateNewCommentRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    comment: {
      creatorId: Types.ObjectId;
      creatorUsername: string;
      creatorRole: UserRoles;

      announcementId: Types.ObjectId;
      parentCommentId: Types.ObjectId;
      comment: string;
      isAnonymous: boolean;
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

type GetAllCommentsRequest = RequestAfterJWTVerification;

type GetCommentsByUserRequest = RequestAfterJWTVerification;

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

interface GetCommentsByAnnouncementIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { announcementId: string };
}

type CommentServerResponse = {
  message: string;
  commentData: Array<CommentDocument>;
};

export type {
  CreateNewCommentRequest,
  DeleteACommentRequest,
  DeleteAllCommentsRequest,
  GetAllCommentsRequest,
  GetCommentsByUserRequest,
  GetCommentByIdRequest,
  GetCommentsByAnnouncementIdRequest,
  CommentServerResponse,
};
