import { Types } from 'mongoose';

import type { DeleteResult } from 'mongodb';
import type { EventCreatorDocument, EventCreatorSchema } from './eventCreator.model';
import type {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
} from '../../../../types';

import { EventCreatorModel } from './eventCreator.model';

async function createNewEventService(
  newEventObj: EventCreatorSchema
): Promise<EventCreatorDocument> {
  try {
    const newEvent = await EventCreatorModel.create(newEventObj);
    return newEvent;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewEventService' });
  }
}

async function getQueriedEventsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<EventCreatorDocument>): DatabaseResponse<EventCreatorDocument> {
  try {
    const allEvents = await EventCreatorModel.find(filter, projection, options).lean().exec();
    return allEvents;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedEventsService' });
  }
}

async function getQueriedTotalEventsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<EventCreatorDocument>): Promise<number> {
  try {
    const totalEvents = await EventCreatorModel.countDocuments(filter).lean().exec();
    return totalEvents;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedtotalEventsService' });
  }
}

async function getQueriedEventsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<EventCreatorDocument>): DatabaseResponse<EventCreatorDocument> {
  try {
    const events = await EventCreatorModel.find(filter, projection, options).lean().exec();
    return events;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedEventsByUserService' });
  }
}

async function getEventByIdService(
  eventId: string | Types.ObjectId
): DatabaseResponseNullable<EventCreatorDocument> {
  try {
    const event = await EventCreatorModel.findById(eventId).lean().exec();
    return event;
  } catch (error: any) {
    throw new Error(error, { cause: 'getEventByIdService' });
  }
}

async function deleteAnEventService(eventId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const deleteResult = await EventCreatorModel.deleteOne({ _id: eventId }).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAnEventService' });
  }
}

async function deleteAllEventsByUserService(
  userId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const events = await EventCreatorModel.deleteMany({ creatorId: userId }).lean().exec();
    return events;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllEventsByUserService' });
  }
}

type UpdateAnEventByIdServiceInput = {
  eventId: string | Types.ObjectId;
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
  getQueriedEventsService,
  getQueriedTotalEventsService,
  getEventByIdService,
  getQueriedEventsByUserService,
  deleteAllEventsByUserService,
  updateAnEventByIdService,
};
