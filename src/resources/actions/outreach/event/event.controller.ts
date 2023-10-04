import expressAsyncHandler from 'express-async-handler';
import type { DeleteResult } from 'mongodb';

import type { Response } from 'express';
import type {
  CreateNewEventRequest,
  DeleteAllEventsByUserRequest,
  DeleteAnEventRequest,
  GetQueriedEventsRequest,
  GetEventByIdRequest,
  GetQueriedEventsByUserRequest,
  UpdateAnEventByIdRequest,
  CreateNewEventsBulkRequest,
} from './event.types';
import {
  createNewEventService,
  deleteAllEventsByUserService,
  deleteAnEventService,
  getQueriedEventsService,
  getEventByIdService,
  getQueriedEventsByUserService,
  updateAnEventByIdService,
  getQueriedTotalEventsService,
} from './event.service';
import { EventCreatorDocument, EventCreatorSchema } from './event.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';

// @desc   Create a new event
// @route  POST /events
// @access Private
const createNewEventHandler = expressAsyncHandler(
  async (
    request: CreateNewEventRequest,
    response: Response<ResourceRequestServerResponse<EventCreatorDocument>>
  ) => {
    const {
      userInfo: { userId, username, roles },
      event: {
        eventTitle,
        eventDescription,
        eventKind,
        eventStartTime,
        eventEndTime,
        eventLocation,
        eventStartDate,
        eventEndDate,
        rsvpDeadline,
        eventAttendees,
        requiredItems,
      },
    } = request.body;

    // create new event object
    const newEventObject: EventCreatorSchema = {
      userId,
      username,
      creatorRole: roles,
      action: 'outreach',
      category: 'event',

      eventTitle,
      eventDescription,
      eventKind,
      eventStartTime,
      eventEndTime,
      eventLocation,
      eventStartDate,
      eventEndDate,
      rsvpDeadline,
      eventAttendees,
      requiredItems,
    };

    // create new event
    const newEvent = await createNewEventService(newEventObject);
    if (newEvent) {
      response
        .status(201)
        .json({ message: `Successfully created event: ${eventTitle}`, resourceData: [newEvent] });
    } else {
      response.status(400).json({ message: 'Unable to create new event', resourceData: [] });
    }
  }
);

// DEV ROUTE
// @desc   Create new events in bulk
// @route  POST /events/dev
// @access Private/Manager/Admin
const createNewEventsBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewEventsBulkRequest,
    response: Response<ResourceRequestServerResponse<EventCreatorDocument>>
  ) => {
    const { events } = request.body;

    // create new events
    const newEvents = await Promise.all(
      events.map(async (event) => {
        const {
          userId,
          username,
          creatorRole,
          eventTitle,
          eventDescription,
          eventKind,
          eventStartTime,
          eventEndTime,
          eventLocation,
          eventStartDate,
          eventEndDate,
          rsvpDeadline,
          eventAttendees,
          requiredItems,
        } = event;

        // create new event object
        const newEventObject: EventCreatorSchema = {
          userId,
          username,
          creatorRole,
          action: 'outreach',
          category: 'event',

          eventTitle,
          eventDescription,
          eventKind,
          eventStartTime,
          eventEndTime,
          eventLocation,
          eventStartDate,
          eventEndDate,
          rsvpDeadline,
          eventAttendees,
          requiredItems,
        };

        // create new event
        const newEvent = await createNewEventService(newEventObject);
        return newEvent;
      })
    );

    // filter out any events that were not created
    const successfullyCreatedEvents = newEvents.filter((event) => event);

    // check if any events were created
    if (successfullyCreatedEvents.length === events.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedEvents.length} events`,
        resourceData: successfullyCreatedEvents,
      });
    } else {
      response.status(400).json({
        message: `Successfully created ${
          successfullyCreatedEvents.length
        } events, but failed to create ${events.length - successfullyCreatedEvents.length} events`,
        resourceData: successfullyCreatedEvents,
      });
    }
  }
);

// @desc   Get all events
// @route  GET /events
// @access Private
const getQueriedEventsHandler = expressAsyncHandler(
  async (
    request: GetQueriedEventsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<EventCreatorDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalEventsService({
        filter: filter as FilterQuery<EventCreatorDocument> | undefined,
      });
    }

    // get all events
    const events = await getQueriedEventsService({
      filter: filter as FilterQuery<EventCreatorDocument> | undefined,
      projection: projection as QueryOptions<EventCreatorDocument>,
      options: options as QueryOptions<EventCreatorDocument>,
    });
    if (events.length === 0) {
      response.status(200).json({
        message: 'No events that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found events',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: events,
      });
    }
  }
);

// @desc   Get all events by user
// @route  GET /events/user
// @access Private
const getQueriedEventsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedEventsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<EventCreatorDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // assign userId to filter
    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalEventsService({
        filter: filterWithUserId,
      });
    }

    const events = await getQueriedEventsByUserService({
      filter: filterWithUserId as FilterQuery<EventCreatorDocument> | undefined,
      projection: projection as QueryOptions<EventCreatorDocument>,
      options: options as QueryOptions<EventCreatorDocument>,
    });
    if (events.length === 0) {
      response.status(200).json({
        message: 'No events found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'events found successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: events,
      });
    }
  }
);

// @desc   Get an event by id
// @route  GET /events/:eventId
// @access Private
const getEventByIdHandler = expressAsyncHandler(
  async (
    request: GetEventByIdRequest,
    response: Response<ResourceRequestServerResponse<EventCreatorDocument>>
  ) => {
    const { eventId } = request.params;

    // get an event by id
    const event = await getEventByIdService(eventId);
    if (event) {
      response.status(200).json({ message: 'Event found successfully', resourceData: [event] });
    } else {
      response.status(400).json({ message: 'Unable to get event', resourceData: [] });
    }
  }
);

// @desc   Delete an event by id
// @route  DELETE /events/:eventId
// @access Private
const deleteAnEventHandler = expressAsyncHandler(
  async (
    request: DeleteAnEventRequest,
    response: Response<ResourceRequestServerResponse<EventCreatorDocument>>
  ) => {
    const { eventId } = request.params;

    // delete an event
    const deletedEvent: DeleteResult = await deleteAnEventService(eventId);
    if (deletedEvent.deletedCount === 1) {
      response.status(200).json({ message: 'Event deleted', resourceData: [] });
    } else {
      response.status(400).json({ message: 'Unable to delete event', resourceData: [] });
    }
  }
);

// @desc   Delete all events by user
// @route  DELETE /events/user
// @access Private/Admin/Manager
const deleteAllEventsByUserHandler = expressAsyncHandler(
  async (
    request: DeleteAllEventsByUserRequest,
    response: Response<ResourceRequestServerResponse<EventCreatorDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;

    // delete all events by user
    const deleteResult: DeleteResult = await deleteAllEventsByUserService(userId);
    if (deleteResult.deletedCount > 0) {
      response.status(200).json({ message: 'Events by user deleted', resourceData: [] });
    } else {
      response.status(400).json({ message: 'Unable to delete events by user', resourceData: [] });
    }
  }
);

// @desc   Update an event by id
// @route  PUT /events/:eventId
// @access Private
const updateAnEventHandler = expressAsyncHandler(
  async (
    request: UpdateAnEventByIdRequest,
    response: Response<ResourceRequestServerResponse<EventCreatorDocument>>
  ) => {
    const { eventId } = request.params;
    const {
      userInfo: { userId, username, roles },
      event: {
        eventTitle,
        eventAttendees,
        eventStartDate,
        eventEndDate,
        eventDescription,
        eventEndTime,
        eventKind,
        eventLocation,
        eventStartTime,
        rsvpDeadline,
        requiredItems,
      },
    } = request.body;

    const existingEvent = await getEventByIdService(eventId);
    if (!existingEvent) {
      response.status(404).json({ message: 'Event not found', resourceData: [] });
      return;
    }

    // only the creator can update the event
    if (existingEvent.userId !== userId) {
      response.status(401).json({
        message: 'Only the originators of an event are allowed to modify the event',
        resourceData: [],
      });
      return;
    }

    const eventToBeUpdated = {
      ...existingEvent,
      creatorId: userId,
      creatorUsername: username,
      creatorRole: roles,
      eventTitle,
      eventDescription,
      eventKind,
      eventStartTime,
      eventEndTime,
      eventLocation,
      eventStartDate,
      eventEndDate,
      rsvpDeadline,
      eventAttendees,
      requiredItems,
    };

    // update an event by id
    const updatedEvent = await updateAnEventByIdService({ eventId, eventToBeUpdated });
    if (updatedEvent) {
      response.status(200).json({ message: 'Event updated', resourceData: [updatedEvent] });
    } else {
      response.status(400).json({ message: 'Unable to update event', resourceData: [] });
    }
  }
);

export {
  createNewEventHandler,
  createNewEventsBulkHandler,
  deleteAnEventHandler,
  getQueriedEventsHandler,
  getEventByIdHandler,
  getQueriedEventsByUserHandler,
  deleteAllEventsByUserHandler,
  updateAnEventHandler,
};
