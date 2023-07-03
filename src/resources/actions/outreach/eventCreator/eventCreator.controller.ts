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

export { createNewEventHandler };
