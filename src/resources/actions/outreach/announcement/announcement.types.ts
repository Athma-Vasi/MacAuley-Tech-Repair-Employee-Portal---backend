import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../../auth";
import type { UserRoles } from "../../../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../../../types";
import { AnnouncementDocument, AnnouncementSchema } from "./announcement.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewAnnouncementRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    announcementSchema: AnnouncementSchema;
  };
}

interface DeleteAnnouncementRequest extends RequestAfterJWTVerification {
  params: {
    announcementId: string;
  };
}

type DeleteAllAnnouncementsRequest = RequestAfterJWTVerification;

type GetQueriedAnnouncementsByUserRequest = GetQueriedResourceByUserRequest;

interface GetAnnouncementByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { announcementId: string };
}

interface UpdateAnnouncementByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<AnnouncementDocument>;
  };
  params: { announcementId: string };
}

type GetQueriedAnnouncementsRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewAnnouncementsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    announcementSchemas: AnnouncementSchema[];
  };
}

// DEV ROUTE
interface UpdateAnnouncementsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    announcementFields: {
      announcementId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<AnnouncementDocument>;
    }[];
  };
}

export type {
  CreateNewAnnouncementRequest,
  DeleteAnnouncementRequest,
  DeleteAllAnnouncementsRequest,
  GetQueriedAnnouncementsByUserRequest,
  GetAnnouncementByIdRequest,
  GetQueriedAnnouncementsRequest,
  UpdateAnnouncementByIdRequest,
  CreateNewAnnouncementsBulkRequest,
  UpdateAnnouncementsBulkRequest,
};
