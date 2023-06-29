import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../auth';
import type { RatingFeel, AnnouncementDocument } from './announcement.model';
import type { UserRoles } from '../user';

interface CreateNewAnnouncementRequest extends RequestAfterJWTVerification {
  body: {
    // userInfo object is decoded from the JWT in the auth middleware: verifyJWT.ts
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    // below are the fields required to be sent with post request
    title: string;
    imageSrc: string;
    imageAlt: string;
    article: Record<string, string[]>;
    timeToRead: number;
    rating: {
      feel: RatingFeel;
      count: number;
    };
  };
}

interface DeleteAnAnnouncementRequest extends RequestAfterJWTVerification {
  params: {
    announcementId: Types.ObjectId;
  };
}

type DeleteAllAnnouncementsRequest = RequestAfterJWTVerification;

type GetAllAnnouncementsRequest = RequestAfterJWTVerification;

type GetAnnouncementsByUserRequest = RequestAfterJWTVerification;

interface GetAnAnnouncementRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    announcementId: Types.ObjectId;
  };
}

interface UpdateAnnouncementRequest extends RequestAfterJWTVerification {
  // userInfo object is decoded from the JWT in the auth middleware: verifyJWT.ts
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    title: string;
    imageSrc: string;
    imageAlt: string;
    article: Record<string, string[]>;
    timeToRead: number;
    rating: {
      feel: RatingFeel;
      count: number;
    };
  };
  params: {
    announcementId: Types.ObjectId;
  };
}

type AnnouncementsServerResponse = {
  message: string;
  announcementData: Array<AnnouncementSchema>;
};

export type {
  CreateNewAnnouncementRequest,
  DeleteAnAnnouncementRequest,
  DeleteAllAnnouncementsRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsByUserRequest,
  GetAnAnnouncementRequest,
  AnnouncementsServerResponse,
};
