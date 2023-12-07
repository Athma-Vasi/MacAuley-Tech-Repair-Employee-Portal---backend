/**
 * This barrel index file is used to import/export event model, router, types, handlers and services
 */

/**
 * Imports
 */

import { EventModel } from "./event.model";
import { eventRouter } from "./event.routes";
import {
  createNewEventHandler,
  createNewEventsBulkHandler,
  deleteAllEventsHandler,
  deleteEventHandler,
  getEventByIdHandler,
  getEventsByUserHandler,
  getQueriedEventsHandler,
  updateEventByIdHandler,
  updateEventsBulkHandler,
} from "./event.controller";
import {
  createNewEventService,
  deleteAllEventsService,
  deleteEventByIdService,
  getEventByIdService,
  getQueriedEventsByUserService,
  getQueriedEventsService,
  getQueriedTotalEventsService,
  updateEventByIdService,
} from "./event.service";

import type {
  CreateNewEventRequest,
  CreateNewEventsBulkRequest,
  DeleteAllEventsRequest,
  DeleteEventRequest,
  GetEventByIdRequest,
  GetQueriedEventsByUserRequest,
  GetQueriedEventsRequest,
  UpdateEventByIdRequest,
  UpdateEventsBulkRequest,
} from "./event.types";
import type { EventDocument, EventSchema, EventKind } from "./event.model";

/**
 * Exports
 */

export {
  EventModel,
  eventRouter,
  createNewEventHandler,
  createNewEventService,
  createNewEventsBulkHandler,
  deleteAllEventsHandler,
  deleteAllEventsService,
  deleteEventByIdService,
  deleteEventHandler,
  getEventByIdHandler,
  getEventByIdService,
  getEventsByUserHandler,
  getQueriedEventsByUserService,
  getQueriedEventsHandler,
  getQueriedEventsService,
  getQueriedTotalEventsService,
  updateEventByIdService,
  updateEventByIdHandler,
  updateEventsBulkHandler,
};

export type {
  CreateNewEventRequest,
  CreateNewEventsBulkRequest,
  DeleteAllEventsRequest,
  DeleteEventRequest,
  GetEventByIdRequest,
  GetQueriedEventsByUserRequest,
  GetQueriedEventsRequest,
  UpdateEventByIdRequest,
  UpdateEventsBulkRequest,
  EventSchema,
  EventDocument,
  EventKind,
};
