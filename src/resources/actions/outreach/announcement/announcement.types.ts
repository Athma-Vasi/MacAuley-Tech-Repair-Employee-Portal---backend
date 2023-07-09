import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { RatingFeel, AnnouncementDocument, AnnouncementSchema } from './announcement.model';
import type { UserRoles } from '../../../user';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewAnnouncementRequest extends RequestAfterJWTVerification {
  body: {
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
    announcementId: string;
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
    announcementId: string;
  };
}

interface UpdateAnnouncementRequest extends RequestAfterJWTVerification {
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
    announcementId: string;
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
