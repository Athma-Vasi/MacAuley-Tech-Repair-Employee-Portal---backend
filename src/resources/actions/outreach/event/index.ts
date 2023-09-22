/**
 * This barrel index file is used to import/export eventCreator model, router, types, handlers and services
 */

/**
 * Imports
 */

import { EventCreatorModel } from './event.model';
import { eventCreatorRouter } from './event.routes';
import {
  createNewEventHandler,
  deleteAllEventsByUserHandler,
  deleteAnEventHandler,
  getQueriedEventsHandler,
  getEventByIdHandler,
  getQueriedEventsByUserHandler,
  updateAnEventHandler,
} from './event.controller';
import {
  createNewEventService,
  deleteAllEventsByUserService,
  deleteAnEventService,
  getQueriedEventsService,
  getEventByIdService,
  getQueriedEventsByUserService,
  updateAnEventByIdService,
} from './event.service';

import type {
  CreateNewEventRequest,
  DeleteAllEventsByUserRequest,
  DeleteAnEventRequest,
  GetQueriedEventsRequest,
  GetEventByIdRequest,
  GetQueriedEventsByUserRequest,
  UpdateAnEventByIdRequest,
} from './event.types';
import type { EventCreatorDocument, EventCreatorSchema, EventKind } from './event.model';

/**
 * Exports
 */

export {
  EventCreatorModel,
  eventCreatorRouter,
  createNewEventHandler,
  deleteAllEventsByUserHandler,
  deleteAnEventHandler,
  getQueriedEventsHandler,
  getEventByIdHandler,
  getQueriedEventsByUserHandler,
  updateAnEventHandler,
  createNewEventService,
  deleteAllEventsByUserService,
  deleteAnEventService,
  getQueriedEventsService,
  getEventByIdService,
  getQueriedEventsByUserService,
  updateAnEventByIdService,
};

export type {
  CreateNewEventRequest,
  DeleteAllEventsByUserRequest,
  DeleteAnEventRequest,
  GetQueriedEventsRequest,
  GetEventByIdRequest,
  GetQueriedEventsByUserRequest,
  UpdateAnEventByIdRequest,
  EventCreatorDocument,
  EventCreatorSchema,
  EventKind,
};
