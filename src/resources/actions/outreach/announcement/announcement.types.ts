import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { UserRoles } from '../../../user';
import { GetQueriedResourceRequest } from '../../../../types';
import { AnnouncementDocument, AnnouncementSchema, RatingResponse } from './announcement.model';

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
      commentIds: Types.ObjectId[];
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
    announcementField: Partial<AnnouncementSchema>;
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
};
