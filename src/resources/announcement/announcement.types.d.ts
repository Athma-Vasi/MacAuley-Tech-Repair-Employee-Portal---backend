import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from './auth';
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
    id: Types.ObjectId;
  };
}

type DeleteAllAnnouncementsRequest = RequestAfterJWTVerification;

type GetAllAnnouncementsRequest = RequestAfterJWTVerification;

interface GetAnnouncementsFromUserIdRequest extends RequestAfterJWTVerification {
  params: {
    userId: Types.ObjectId;
  };
}

interface UpdateAnnouncementRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    id: Types.ObjectId; // id of announcement to update
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

type AnnouncementsServerResponse = {
  message: string;
  announcementData: Array<AnnouncementDocument>;
};

export type {
  CreateNewAnnouncementRequest,
  DeleteAnAnnouncementRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsFromUserIdRequest,
  AnnouncementsServerResponse,
};
