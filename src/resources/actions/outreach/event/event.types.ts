import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { UserRoles } from '../../../user';
import type { EventCreatorDocument, EventKind } from './event.model';
import { GetQueriedResourceRequest } from '../../../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface CreateNewEventRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    event: {
      eventTitle: string;
      eventDescription: string;
      eventKind: EventKind;
      eventStartDate: NativeDate;
      eventEndDate: NativeDate;
      eventStartTime: string;
      eventEndTime: string;
      eventLocation: string;
      eventAttendees: string;
      requiredItems: string;
      rsvpDeadline: NativeDate;
    };
  };
}

// DEV ROUTE
interface CreateNewEventsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    events: {
      userId: Types.ObjectId;
      username: string;
      creatorRole: UserRoles;
      eventTitle: string;
      eventDescription: string;
      eventKind: EventKind;
      eventStartDate: NativeDate;
      eventEndDate: NativeDate;
      eventStartTime: string;
      eventEndTime: string;
      eventLocation: string;
      eventAttendees: string;
      requiredItems: string;
      rsvpDeadline: NativeDate;
    }[];
  };
}

interface DeleteAnEventRequest extends RequestAfterJWTVerification {
  params: {
    eventId: string;
  };
}

type DeleteAllEventsByUserRequest = RequestAfterJWTVerification;

type GetQueriedEventsRequest = GetQueriedResourceRequest;

type GetQueriedEventsByUserRequest = GetQueriedResourceRequest;

interface GetEventByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { eventId: string };
}

interface UpdateAnEventByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    event: EventCreatorDocument;
  };
  params: { eventId: string };
}

export type {
  CreateNewEventRequest,
  CreateNewEventsBulkRequest,
  DeleteAnEventRequest,
  DeleteAllEventsByUserRequest,
  GetQueriedEventsRequest,
  GetQueriedEventsByUserRequest,
  GetEventByIdRequest,
  UpdateAnEventByIdRequest,
};
