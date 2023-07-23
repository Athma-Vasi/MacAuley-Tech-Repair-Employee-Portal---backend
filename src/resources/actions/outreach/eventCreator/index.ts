/**
 * This barrel index file is used to import/export eventCreator model, router, types, handlers and services
 */

/**
 * Imports
 */

import { EventCreatorModel } from './eventCreator.model';
import { eventCreatorRouter } from './eventCreator.routes';
import {
  createNewEventHandler,
  deleteAllEventsByUserHandler,
  deleteAnEventHandler,
  getQueriedEventsHandler,
  getEventByIdHandler,
  getQueriedEventsByUserHandler,
  updateAnEventHandler,
} from './eventCreator.controller';
import {
  createNewEventService,
  deleteAllEventsByUserService,
  deleteAnEventService,
  getQueriedEventsService,
  getEventByIdService,
  getQueriedEventsByUserService,
  updateAnEventByIdService,
} from './eventCreator.service';

import type {
  CreateNewEventRequest,
  DeleteAllEventsByUserRequest,
  DeleteAnEventRequest,
  GetQueriedEventsRequest,
  GetEventByIdRequest,
  GetQueriedEventsByUserRequest,
  UpdateAnEventByIdRequest,
} from './eventCreator.types';
import type { EventCreatorDocument, EventCreatorSchema, EventKind } from './eventCreator.model';

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
