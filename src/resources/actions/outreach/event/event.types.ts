import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../../auth";
import type { UserRoles } from "../../../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../../../types";
import { EventDocument, EventSchema } from "./event.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewEventRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    eventSchema: EventSchema;
  };
}

interface DeleteEventRequest extends RequestAfterJWTVerification {
  params: {
    eventId: string;
  };
}

type DeleteAllEventsRequest = RequestAfterJWTVerification;

type GetQueriedEventsByUserRequest = GetQueriedResourceByUserRequest;

interface GetEventByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    newQueryFlag: boolean;
    totalDocuments: number;
  };
  query: {
    projection: string | string[] | Record<string, any>;
    options: Record<string, any>;
    filter: Record<string, any>;
  };
  params: { eventId: string };
}

interface UpdateEventByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<EventDocument>;
  };
  params: { eventId: string };
}

type GetQueriedEventsRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewEventsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    eventSchemas: EventSchema[];
  };
}

// DEV ROUTE
interface UpdateEventsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    eventFields: {
      eventId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<EventDocument>;
    }[];
  };
}

export type {
  CreateNewEventRequest,
  DeleteEventRequest,
  DeleteAllEventsRequest,
  GetQueriedEventsByUserRequest,
  GetEventByIdRequest,
  GetQueriedEventsRequest,
  UpdateEventByIdRequest,
  CreateNewEventsBulkRequest,
  UpdateEventsBulkRequest,
};
