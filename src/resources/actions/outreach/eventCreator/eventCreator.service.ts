import { Types } from 'mongoose';

import type { DeleteResult } from 'mongodb';
import type { EventCreatorDocument, EventCreatorSchema, EventKind } from './eventCreator.model';
import type { DatabaseResponse, DatabaseResponseNullable } from '../../../../types';

import { EventCreatorModel } from './eventCreator.model';

type CreateNewEventCreatorServiceInput = {
  creatorId: Types.ObjectId;
  creatorUsername: string;
  creatorRole: string;
  eventTitle: string;
  eventDescription: string;
  eventKind: EventKind;
  eventDate: Date;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation: string;
  eventAttendees: string;
  requiredItems: string;
  rsvpDeadline: Date;
};

async function createNewEventService(newEventObj: CreateNewEventCreatorServiceInput) {
  try {
    const newEvent = await EventCreatorModel.create(newEventObj);
    return newEvent;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewEventService' });
  }
}

async function deleteAnEventService(eventId: Types.ObjectId): Promise<DeleteResult> {
  try {
    const deleteResult = await EventCreatorModel.deleteOne({ _id: eventId }).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAnEventService' });
  }
}

async function getAllEventsService(): DatabaseResponse<EventCreatorDocument> {
  try {
    const allEvents = await EventCreatorModel.find({}).lean().exec();
    return allEvents;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllEventsService' });
  }
}

export { createNewEventService, deleteAnEventService, getAllEventsService };
