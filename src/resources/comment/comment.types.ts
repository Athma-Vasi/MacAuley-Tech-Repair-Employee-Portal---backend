import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../auth";
import type { UserRoles } from "../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../types";
import { CommentDocument, CommentSchema } from "./comment.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewCommentRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    commentSchema: CommentSchema;
  };
}

interface DeleteCommentRequest extends RequestAfterJWTVerification {
  params: {
    commentId: string;
  };
}

type DeleteAllCommentsRequest = RequestAfterJWTVerification;

type GetQueriedCommentsByUserRequest = GetQueriedResourceByUserRequest;
interface GetQueriedCommentsByParentResourceIdRequest extends GetQueriedResourceRequest {
  params: { parentResourceId: string };
}

interface GetCommentByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    newQueryFlag: boolean;
    totalDocuments: number;
  };
  query: {
    projection: string | string[] | Record<string, any>;
    options: Record<string, any>;
    filter: Record<string, any>;
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
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<CommentDocument>;
  };
  params: { commentId: string };
}

type GetQueriedCommentsRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewCommentsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    commentSchemas: CommentSchema[];
  };
}

// DEV ROUTE
interface UpdateCommentsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    commentFields: {
      commentId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<CommentDocument>;
    }[];
  };
}

export type {
  CreateNewCommentRequest,
  CreateNewCommentsBulkRequest,
  DeleteAllCommentsRequest,
  DeleteCommentRequest,
  GetCommentByIdRequest,
  GetQueriedCommentsByParentResourceIdRequest,
  GetQueriedCommentsByUserRequest,
  GetQueriedCommentsRequest,
  UpdateCommentByIdRequest,
  UpdateCommentsBulkRequest,
};
