import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from './auth';
import type { RatingFeel } from './announcement.model';

interface CreateNewAnnouncementRequest extends RequestAfterJWTVerification {
  body: {
    user: Types.ObjectId;
    title: string;
    username: string;
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

interface DeleteAnnouncementRequest extends RequestAfterJWTVerification {
  params: {
    id: Types.ObjectId;
  };
}

// converted to type alias instead of interface because an interface declaring no members is equivalent to its supertype and rome doesn't like that
type GetAllAnnouncementsRequest = RequestAfterJWTVerification;

interface GetAnnouncementsFromUserIdRequest extends RequestAfterJWTVerification {
  params: {
    userId: Types.ObjectId;
  };
}

interface UpdateAnnouncementRequest extends RequestAfterJWTVerification {
  params: {
    id: Types.ObjectId;
  };
  body: {
    // id: Types.ObjectId;
    user: Types.ObjectId;
    title: string;
    username: string;
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

// rome-ignore lint/suspicious/noEmptyInterface: <temporary>
interface GetAllAnnouncementsReturn {}

/**
 *
 *
 */

export type {
  // announcement requests
  CreateNewAnnouncementRequest,
  DeleteAnnouncementRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsFromUserIdRequest,

  // announcement return types from service
  GetAllAnnouncementsReturn,
};
