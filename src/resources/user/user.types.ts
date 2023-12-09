import { Types } from "mongoose";

import type { RequestAfterJWTVerification } from "../auth";
import type { UserDocument, UserSchema } from "./user.model";
import { DocumentUpdateOperation, GetQueriedResourceRequest } from "../../types";
import { UserRoles } from "../user";
import { ProductReviewDocument } from "../productReview";
import { PurchaseDocument } from "../purchase";
import { RMADocument } from "../rma";
import { SurveyDocument } from "../actions/outreach/survey";

interface CreateNewUserRequest {
  body: {
    userSchema: UserSchema;
  };
}

interface DeleteUserRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    // newQueryFlag: boolean;
    // totalDocuments: number;
  };
  // query: {
  //   projection: string | string[] | Record<string, any>;
  //   options: Record<string, any>;
  //   filter: Record<string, any>;
  // };
  params: { userToBeDeletedId: string };
}

interface DeleteAllUsersRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    // newQueryFlag: boolean;
    // totalDocuments: number;
  };
  // query: {
  //   projection: string | string[] | Record<string, any>;
  //   options: Record<string, any>;
  //   filter: Record<string, any>;
  // };
}

type GetAllUsersRequest = GetQueriedResourceRequest;

type GetUsersDirectoryRequest = RequestAfterJWTVerification;

interface GetUserByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    // newQueryFlag: boolean;
    // totalDocuments: number;
  };
  // query: {
  //   projection: string | string[] | Record<string, any>;
  //   options: Record<string, any>;
  //   filter: Record<string, any>;
  // };
  params: { userId: string };
}

interface UpdateUserRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<UserDocument>;
  };
  params: { userToBeUpdatedId: string };
}

interface UpdateUserPasswordRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    currentPassword: string;
    newPassword: string;
  };
  params: { userId: string };
}

// DEV ROUTE
interface CreateNewUsersBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    userSchemas: UserSchema[];
  };
}

// DEV ROUTE
interface UpdateUserFieldsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    userFields: {
      userId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<UserDocument>;
    }[];
  };
}

// DEV ROUTE
interface GetAllUsersBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    // newQueryFlag: boolean;
    // totalDocuments: number;
  };
  // query: {
  //   projection: string | string[] | Record<string, any>;
  //   options: Record<string, any>;
  //   filter: Record<string, any>;
  // };
}

export type {
  CreateNewUserRequest,
  CreateNewUsersBulkRequest,
  DeleteAllUsersRequest,
  DeleteUserRequest,
  GetAllUsersBulkRequest,
  GetAllUsersRequest,
  GetUserByIdRequest,
  GetUsersDirectoryRequest,
  UpdateUserFieldsBulkRequest,
  UpdateUserPasswordRequest,
  UpdateUserRequest,
};
