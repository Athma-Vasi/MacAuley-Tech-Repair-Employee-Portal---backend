import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../auth';
import type { UserRoles } from '../user';
import type { EventKind } from './eventCreator.model';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface CreateNewEventRequest extends RequestAfterJWTVerification {
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
      eventDate: NativeDate;
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
    eventId: Types.ObjectId;
  };
}

type DeleteAllEventsByUserRequest = RequestAfterJWTVerification;

type GetAllEventsRequest = RequestAfterJWTVerification;

type GetEventsByUserRequest = RequestAfterJWTVerification;

interface GetEventByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { eventId: Types.ObjectId };
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
      eventDate: NativeDate;
      eventStartTime: string;
      eventEndTime: string;
      eventLocation: string;
      eventAttendees: string;
      requiredItems: string;
      rsvpDeadline: NativeDate;
    };
  };
  params: { eventId: Types.ObjectId };
}

type EventServerResponse = {
  message: string;
  eventData: Array<EventDocument>;
};

export type {
  CreateNewEventRequest,
  DeleteAnEventRequest,
  DeleteAllEventsByUserRequest,
  GetAllEventsRequest,
  GetEventsByUserRequest,
  GetEventByIdRequest,
  UpdateAnEventByIdRequest,
  EventServerResponse,
};
