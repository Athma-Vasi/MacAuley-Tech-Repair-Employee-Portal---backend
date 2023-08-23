import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { UserRoles } from '../../../user';
import { GetQueriedResourceRequest } from '../../../../types';
import { AnnouncementSchema, RatingResponse } from './announcement.model';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewAnnouncementRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    // below are the fields required to be sent with post request
    announcement: {
      title: string;
      author: string;
      bannerImageSrc: string;
      bannerImageAlt: string;
      article: string[];
      timeToRead: number;
      ratingResponse: RatingResponse;
      ratedUserIds: Types.ObjectId[];
    };
  };
}

interface DeleteAnAnnouncementRequest extends RequestAfterJWTVerification {
  params: {
    announcementId: string;
  };
}

type DeleteAllAnnouncementsRequest = RequestAfterJWTVerification;

type GetAllAnnouncementsRequest = GetQueriedResourceRequest;

type GetAnnouncementsByUserRequest = GetQueriedResourceRequest;

interface GetAnnouncementRequestById extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    params: { announcementId: string };
  };
}

interface UpdateAnnouncementRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    announcementFields: Partial<AnnouncementSchema>;
  };
  params: {
    announcementId: string;
  };
}

interface UpdateAnnouncementRatingRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    announcementFields: {
      ratedUserIds: Types.ObjectId[];
      ratingResponse: RatingResponse;
    };
  };
  params: {
    announcementId: string;
  };
}

export type {
  CreateNewAnnouncementRequest,
  DeleteAnAnnouncementRequest,
  DeleteAllAnnouncementsRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsByUserRequest,
  GetAnnouncementRequestById,
  UpdateAnnouncementRatingRequest,
};
