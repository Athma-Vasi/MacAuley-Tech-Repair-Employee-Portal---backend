import { Types } from 'mongoose';

import type { DeleteResult } from 'mongodb';
import type { EventCreatorDocument, EventCreatorSchema, EventKind } from './eventCreator.model';
import type { DatabaseResponse, DatabaseResponseNullable } from '../../../../types';

import { EventCreatorModel } from './eventCreator.model';

type CreateNewEventCreatorServiceInput = {
  creatorId: Types.ObjectId;
  creatorUsername: string;
  creatorRole: string;
  eventName: string;
  eventDescription: string;
  eventKind: EventKind;
  eventDate: NativeDate;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation: string;
  eventAttendees: string;
  requiredItems: string;
  rsvpDeadline: NativeDate;
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

async function getEventByIdService(
  eventId: Types.ObjectId
): DatabaseResponseNullable<EventCreatorDocument> {
  try {
    const event = await EventCreatorModel.findById(eventId).lean().exec();
    return event;
  } catch (error: any) {
    throw new Error(error, { cause: 'getEventByIdService' });
  }
}

async function getEventsByUserService(
  userId: Types.ObjectId
): DatabaseResponse<EventCreatorDocument> {
  try {
    const events = await EventCreatorModel.find({ creatorId: userId }).lean().exec();
    return events;
  } catch (error: any) {
    throw new Error(error, { cause: 'getEventsByUserService' });
  }
}

async function deleteAllEventsByUserService(userId: Types.ObjectId): Promise<DeleteResult> {
  try {
    const events = await EventCreatorModel.deleteMany({ creatorId: userId }).lean().exec();
    return events;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllEventsByUserService' });
  }
}

type UpdateAnEventByIdServiceInput = {
  eventId: Types.ObjectId;
  eventToBeUpdated: EventCreatorDocument;
};

async function updateAnEventByIdService({
  eventId,
  eventToBeUpdated,
}: UpdateAnEventByIdServiceInput): DatabaseResponseNullable<EventCreatorDocument> {
  try {
    const event = await EventCreatorModel.findByIdAndUpdate(eventId, eventToBeUpdated, {
      new: true,
    })
      .lean()
      .exec();
    return event;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateAnEventByIdService' });
  }
}

export {
  createNewEventService,
  deleteAnEventService,
  getAllEventsService,
  getEventByIdService,
  getEventsByUserService,
  deleteAllEventsByUserService,
  updateAnEventByIdService,
};
