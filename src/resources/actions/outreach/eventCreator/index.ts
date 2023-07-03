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
  getAllEventsHandler,
  getEventByIdHandler,
  getEventsByUserHandler,
  updateAnEventHandler,
} from './eventCreator.controller';
import {
  createNewEventService,
  deleteAllEventsByUserService,
  deleteAnEventService,
  getAllEventsService,
  getEventByIdService,
  getEventsByUserService,
  updateAnEventByIdService,
} from './eventCreator.service';

import type {
  CreateNewEventRequest,
  DeleteAllEventsByUserRequest,
  DeleteAnEventRequest,
  EventServerResponse,
  GetAllEventsRequest,
  GetEventByIdRequest,
  GetEventsByUserRequest,
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
  getAllEventsHandler,
  getEventByIdHandler,
  getEventsByUserHandler,
  updateAnEventHandler,
  createNewEventService,
  deleteAllEventsByUserService,
  deleteAnEventService,
  getAllEventsService,
  getEventByIdService,
  getEventsByUserService,
  updateAnEventByIdService,
};

export type {
  CreateNewEventRequest,
  DeleteAllEventsByUserRequest,
  DeleteAnEventRequest,
  EventServerResponse,
  GetAllEventsRequest,
  GetEventByIdRequest,
  GetEventsByUserRequest,
  UpdateAnEventByIdRequest,
  EventCreatorDocument,
  EventCreatorSchema,
  EventKind,
};
