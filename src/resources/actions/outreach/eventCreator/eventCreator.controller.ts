import expressAsyncHandler from 'express-async-handler';
import { Types } from 'mongoose';

import type { Response } from 'express';
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
import {
  createNewEventService,
  deleteAllEventsByUserService,
  deleteAnEventService,
  getAllEventsService,
  getEventByIdService,
  getEventsByUserService,
  updateAnEventByIdService,
} from './eventCreator.service';

// @desc   Create a new event
// @route  POST /events
// @access Private
const createNewEventHandler = expressAsyncHandler(
  async (request: CreateNewEventRequest, response: Response<EventServerResponse>) => {
    const {
      userInfo: { userId, username, roles },
      event: {
        eventName,
        eventDescription,
        eventKind,
        eventStartTime,
        eventEndTime,
        eventLocation,
        eventDate,
        rsvpDeadline,
        eventAttendees,
        requiredItems,
      },
    } = request.body;

    // create new event object
    const newEventObject = {
      creatorId: userId,
      creatorUsername: username,
      creatorRole: roles,
      eventName,
      eventDescription,
      eventKind,
      eventStartTime,
      eventEndTime,
      eventLocation,
      eventDate,
      rsvpDeadline,
      eventAttendees,
      requiredItems,
    };

    // create new event
    const newEvent = await createNewEventService(newEventObject);
    if (newEvent) {
      response.status(201).json({ message: 'New event created', eventData: [newEvent] });
    } else {
      response.status(400).json({ message: 'Unable to create new event', eventData: [] });
    }
  }
);

// @desc   Delete an event by id
// @route  DELETE /events/:eventId
// @access Private
const deleteAnEventHandler = expressAsyncHandler(
  async (request: DeleteAnEventRequest, response: Response<EventServerResponse>) => {
    const { eventId } = request.params;

    // delete an event
    const deletedEvent = await deleteAnEventService(eventId);
    if (deletedEvent.deletedCount === 1) {
      response.status(200).json({ message: 'Event deleted', eventData: [deletedEvent] });
    } else {
      response.status(400).json({ message: 'Unable to delete event', eventData: [] });
    }
  }
);

// @desc   Get all events
// @route  GET /events
// @access Private
const getAllEventsHandler = expressAsyncHandler(
  async (request: GetAllEventsRequest, response: Response<EventServerResponse>) => {
    // get all events
    const allEvents = await getAllEventsService();
    if (allEvents.length > 0) {
      response.status(200).json({ message: 'All events', eventData: allEvents });
    } else {
      response.status(400).json({ message: 'Unable to get all events', eventData: [] });
    }
  }
);

// @desc   Get an event by id
// @route  GET /events/:eventId
// @access Private
const getEventByIdHandler = expressAsyncHandler(
  async (request: GetEventByIdRequest, response: Response<EventServerResponse>) => {
    const { eventId } = request.params;

    // get an event by id
    const event = await getEventByIdService(eventId);
    if (event) {
      response.status(200).json({ message: 'Event', eventData: [event] });
    } else {
      response.status(400).json({ message: 'Unable to get event', eventData: [] });
    }
  }
);

// @desc   Get all events by user
// @route  GET /events/user
// @access Private
const getEventsByUserHandler = expressAsyncHandler(
  async (request: GetEventsByUserRequest, response: Response<EventServerResponse>) => {
    // anyone can view their own events
    const {
      userInfo: { userId },
    } = request.body;

    // get all events by user
    const eventsByUser = await getEventsByUserService(userId);
    if (eventsByUser.length > 0) {
      response.status(200).json({ message: 'Events by user', eventData: eventsByUser });
    } else {
      response.status(400).json({ message: 'Unable to get events by user', eventData: [] });
    }
  }
);

// @desc   Delete all events by user
// @route  DELETE /events/user
// @access Private/Admin/Manager
const deleteAllEventsByUserHandler = expressAsyncHandler(
  async (request: DeleteAllEventsByUserRequest, response: Response<EventServerResponse>) => {
    const {
      userInfo: { userId },
    } = request.body;

    // delete all events by user
    const deleteResult = await deleteAllEventsByUserService(userId);
    if (deleteResult.deletedCount > 0) {
      response.status(200).json({ message: 'Events by user deleted', eventData: [] });
    } else {
      response.status(400).json({ message: 'Unable to delete events by user', eventData: [] });
    }
  }
);

// @desc   Update an event by id
// @route  PUT /events/:eventId
// @access Private
const updateAnEventHandler = expressAsyncHandler(
  async (request: UpdateAnEventByIdRequest, response: Response<EventServerResponse>) => {
    const { eventId } = request.params;
    const {
      userInfo: { userId, username, roles },
      event: {
        eventName,
        eventAttendees,
        eventDate,
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
      response.status(404).json({ message: 'Event not found', eventData: [] });
      return;
    }

    // only the creator can update the event
    if (existingEvent.creatorId !== userId) {
      response.status(401).json({
        message: 'Only the originators of an event are allowed to modify the event',
        eventData: [],
      });
      return;
    }

    const eventToBeUpdated = {
      ...existingEvent,
      creatorId: userId,
      creatorUsername: username,
      creatorRole: roles,
      eventName,
      eventDescription,
      eventKind,
      eventStartTime,
      eventEndTime,
      eventLocation,
      eventDate,
      rsvpDeadline,
      eventAttendees,
      requiredItems,
    };

    // update an event by id
    const updatedEvent = await updateAnEventByIdService({ eventId, eventToBeUpdated });
    if (updatedEvent) {
      response.status(200).json({ message: 'Event updated', eventData: [updatedEvent] });
    } else {
      response.status(400).json({ message: 'Unable to update event', eventData: [] });
    }
  }
);
export { createNewEventHandler };
