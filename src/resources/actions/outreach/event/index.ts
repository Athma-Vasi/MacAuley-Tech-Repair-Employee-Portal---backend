/**
 * This barrel index file is used to import/export event model, router, types, handlers and services
 */

/**
 * Imports
 */

import { EventModel } from "./event.model";
import { eventRouter } from "./event.routes";
import {
  createNewEventController,
  createNewEventsBulkController,
  deleteAllEventsController,
  deleteEventController,
  getEventByIdController,
  getEventsByUserController,
  getQueriedEventsController,
  updateEventByIdController,
  updateEventsBulkController,
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
  createNewEventController,
  createNewEventService,
  createNewEventsBulkController,
  deleteAllEventsController,
  deleteAllEventsService,
  deleteEventByIdService,
  deleteEventController,
  getEventByIdController,
  getEventByIdService,
  getEventsByUserController,
  getQueriedEventsByUserService,
  getQueriedEventsController,
  getQueriedEventsService,
  getQueriedTotalEventsService,
  updateEventByIdService,
  updateEventByIdController,
  updateEventsBulkController,
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
