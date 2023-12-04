import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { EventDocument, EventSchema } from "./event.model";

import { EventModel } from "./event.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../../../types";

async function getEventByIdService(
  eventId: Types.ObjectId | string
): DatabaseResponseNullable<EventDocument> {
  try {
    const event = await EventModel.findById(eventId).lean().exec();
    return event;
  } catch (error: any) {
    throw new Error(error, { cause: "getEventByIdService" });
  }
}

async function createNewEventService(eventSchema: EventSchema): Promise<EventDocument> {
  try {
    const event = await EventModel.create(eventSchema);
    return event;
  } catch (error: any) {
    throw new Error(error, { cause: "createNewEventService" });
  }
}

async function getQueriedEventsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<EventDocument>): DatabaseResponse<EventDocument> {
  try {
    const event = await EventModel.find(filter, projection, options).lean().exec();
    return event;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedEventsService" });
  }
}

async function getQueriedTotalEventsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<EventDocument>): Promise<number> {
  try {
    const totalEvents = await EventModel.countDocuments(filter).lean().exec();
    return totalEvents;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedTotalEventsService" });
  }
}

async function getQueriedEventsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<EventDocument>): DatabaseResponse<EventDocument> {
  try {
    const events = await EventModel.find(filter, projection, options).lean().exec();
    return events;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedEventsByUserService" });
  }
}

async function updateEventByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<EventDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const event = await EventModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return event;
  } catch (error: any) {
    throw new Error(error, { cause: "updateEventStatusByIdService" });
  }
}

async function deleteEventByIdService(
  eventId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await EventModel.deleteOne({
      _id: eventId,
    })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteEventByIdService" });
  }
}

async function deleteAllEventsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await EventModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAllEventsService" });
  }
}

export {
  getEventByIdService,
  createNewEventService,
  getQueriedEventsService,
  getQueriedTotalEventsService,
  getQueriedEventsByUserService,
  deleteEventByIdService,
  deleteAllEventsService,
  updateEventByIdService,
};
