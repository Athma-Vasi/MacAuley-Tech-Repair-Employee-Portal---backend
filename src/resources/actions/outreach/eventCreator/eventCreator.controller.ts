import expressAsyncHandler from 'express-async-handler';
import { Types } from 'mongoose';

import type { Response } from 'express';
import type {
  CreateNewEventRequest,
  DeleteAllEventsByUserRequest,
  DeleteAnEventRequest,
  EventServerResponse,
  GetAllEventsRequest,
  GetEventsByIdRequest,
  GetEventsByUserRequest,
} from './eventCreator.types';
import { createNewEventService, deleteAnEventService } from './eventCreator.service';

// @desc   Create a new event
// @route  POST /events
// @access Private/Admin/Manager
const createNewEventHandler = expressAsyncHandler(
  async (request: CreateNewEventRequest, response: Response<EventServerResponse>) => {
    const {
      userInfo: { userId, username, roles },
      event: {
        eventName,
        eventDescription,
        eventKind,
        eventStartDate,
        eventEndDate,
        eventLocation,
        isEventActive,
      },
    } = request.body;

    // create new event object
    const newEventObject = {
      userId,
      username,
      eventKind,
      eventName,
      eventDescription,
      eventStartDate,
      eventEndDate,
      eventLocation,
      isEventActive,
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
// @access Private/Admin/Manager
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

export { createNewEventHandler };
