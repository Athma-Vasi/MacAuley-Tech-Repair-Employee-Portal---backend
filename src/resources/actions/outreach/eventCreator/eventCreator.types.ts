import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { UserRoles } from '../../../user';
import type { EventCreatorDocument, EventKind } from './eventCreator.model';
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
    event: {
      eventName: string;
      eventDescription: string;
      eventKind: EventKind;
      eventStartDate: NativeDate;
      eventStartTime: string;
      eventEndDate: NativeDate;
      eventEndTime: string;
      eventLocation: string;
      eventAttendees: string;
      requiredItems: string;
      rsvpDeadline: NativeDate;
    };
  };
  params: { eventId: string };
}

export type {
  CreateNewEventRequest,
  DeleteAnEventRequest,
  DeleteAllEventsByUserRequest,
  GetQueriedEventsRequest,
  GetQueriedEventsByUserRequest,
  GetEventByIdRequest,
  UpdateAnEventByIdRequest,
};
