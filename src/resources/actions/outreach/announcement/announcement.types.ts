import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { RatingFeel } from './announcement.model';
import type { UserRoles } from '../../../user';
import { GetQueriedResourceRequest } from '../../../../types';

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
    bannerImageSrc: string;
    bannerImageAlt: string;
    article: Record<string, string[]>;
    timeToRead: number;
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
    title: string;
    bannerImageSrc: string;
    bannerImageAlt: string;
    article: Record<string, string[]>;
    timeToRead: number;
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
