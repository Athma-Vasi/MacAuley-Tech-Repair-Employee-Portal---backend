import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewEventRequest,
  CreateNewEventsBulkRequest,
  DeleteAllEventsRequest,
  DeleteEventRequest,
  GetEventByIdRequest,
  GetQueriedEventsByUserRequest,
  GetQueriedEventsRequest,
  UpdateEventByIdRequest,
  UpdateEventsBulkRequest,
} from "./event.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import type { EventDocument, EventSchema } from "./event.model";

import {
  createNewEventService,
  deleteAllEventsService,
  deleteEventByIdService,
  getEventByIdService,
  getQueriedEventsByUserService,
  getQueriedEventsService,
  getQueriedTotalEventsService,
  updateEventByIdService,
} from "./event.service";
import { removeUndefinedAndNullValues } from "../../../../utils";
import { getUserByIdService } from "../../../user";
import createHttpError from "http-errors";

// @desc   Create a new event
// @route  POST api/v1/actions/general/event
// @access Private
const createNewEventController = expressAsyncController(
  async (
    request: CreateNewEventRequest,
    response: Response<ResourceRequestServerResponse<EventDocument>>,
    next: NextFunction
  ) => {
    const { eventSchema } = request.body;

    const eventDocument = await createNewEventService(eventSchema);
    if (!eventDocument) {
      return next(new createHttpError.InternalServerError("Event creation failed"));
    }

    response.status(201).json({
      message: "Successfully created event",
      resourceData: [eventDocument],
    });
  }
);

// @desc   Get all events
// @route  GET api/v1/actions/general/event
// @access Private/Admin/Manager
const getQueriedEventsController = expressAsyncController(
  async (
    request: GetQueriedEventsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<EventDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalEventsService({
        filter: filter as FilterQuery<EventDocument> | undefined,
      });
    }

    const event = await getQueriedEventsService({
      filter: filter as FilterQuery<EventDocument> | undefined,
      projection: projection as QueryOptions<EventDocument>,
      options: options as QueryOptions<EventDocument>,
    });

    if (!event.length) {
      response.status(200).json({
        message: "No events that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Events found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: event,
    });
  }
);

// @desc   Get all event requests by user
// @route  GET api/v1/actions/general/event
// @access Private
const getEventsByUserController = expressAsyncController(
  async (
    request: GetQueriedEventsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<EventDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalEventsService({
        filter: filterWithUserId,
      });
    }

    const events = await getQueriedEventsByUserService({
      filter: filterWithUserId as FilterQuery<EventDocument> | undefined,
      projection: projection as QueryOptions<EventDocument>,
      options: options as QueryOptions<EventDocument>,
    });

    if (!events.length) {
      response.status(200).json({
        message: "No event requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Event requests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: events,
    });
  }
);

// @desc   Update event status
// @route  PATCH api/v1/actions/general/event
// @access Private/Admin/Manager
const updateEventByIdController = expressAsyncController(
  async (
    request: UpdateEventByIdRequest,
    response: Response<ResourceRequestServerResponse<EventDocument>>,
    next: NextFunction
  ) => {
    const { eventId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      return next(new createHttpError.NotFound("User not found"));
    }

    const updatedEvent = await updateEventByIdService({
      _id: eventId,
      fields,
      updateOperator,
    });
    if (!updatedEvent) {
      return next(
        new createHttpError.InternalServerError("Event request status update failed")
      );
    }

    response.status(200).json({
      message: "Event request status updated successfully",
      resourceData: [updatedEvent],
    });
  }
);

// @desc   Get an event request
// @route  GET api/v1/actions/general/event
// @access Private
const getEventByIdController = expressAsyncController(
  async (
    request: GetEventByIdRequest,
    response: Response<ResourceRequestServerResponse<EventDocument>>,
    next: NextFunction
  ) => {
    const { eventId } = request.params;
    const event = await getEventByIdService(eventId);
    if (!event) {
      return next(new createHttpError.NotFound("Event request not found"));
    }

    response.status(200).json({
      message: "Event request found successfully",
      resourceData: [event],
    });
  }
);

// @desc   Delete an event request by its id
// @route  DELETE api/v1/actions/general/event
// @access Private
const deleteEventController = expressAsyncController(
  async (request: DeleteEventRequest, response: Response, next: NextFunction) => {
    const { eventId } = request.params;

    const deletedResult: DeleteResult = await deleteEventByIdService(eventId);
    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError("Event request deletion failed")
      );
    }

    response.status(200).json({
      message: "Event request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all event requests
// @route   DELETE api/v1/actions/general/request-resource/event
// @access  Private
const deleteAllEventsController = expressAsyncController(
  async (_request: DeleteAllEventsRequest, response: Response, next: NextFunction) => {
    const deletedResult: DeleteResult = await deleteAllEventsService();
    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError("All event requests deletion failed")
      );
    }

    response.status(200).json({
      message: "All event requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new event requests in bulk
// @route  POST api/v1/actions/general/event
// @access Private
const createNewEventsBulkController = expressAsyncController(
  async (
    request: CreateNewEventsBulkRequest,
    response: Response<ResourceRequestServerResponse<EventDocument>>
  ) => {
    const { eventSchemas } = request.body;

    const eventDocuments = await Promise.all(
      eventSchemas.map(async (eventSchema) => {
        const eventDocument = await createNewEventService(eventSchema);
        return eventDocument;
      })
    );

    const filteredEventDocuments = eventDocuments.filter(removeUndefinedAndNullValues);

    if (filteredEventDocuments.length === 0) {
      response.status(400).json({
        message: "Event requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount = eventSchemas.length - filteredEventDocuments.length;

    response.status(201).json({
      message: `Successfully created ${filteredEventDocuments.length} Event requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredEventDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update Events in bulk
// @route  PATCH api/v1/actions/general/event
// @access Private
const updateEventsBulkController = expressAsyncController(
  async (
    request: UpdateEventsBulkRequest,
    response: Response<ResourceRequestServerResponse<EventDocument>>
  ) => {
    const { eventFields } = request.body;

    const updatedEvents = await Promise.all(
      eventFields.map(async (eventField) => {
        const {
          documentUpdate: { fields, updateOperator },
          eventId,
        } = eventField;

        const updatedEvent = await updateEventByIdService({
          _id: eventId,
          fields,
          updateOperator,
        });

        return updatedEvent;
      })
    );

    const successfullyCreatedEvents = updatedEvents.filter(removeUndefinedAndNullValues);

    if (successfullyCreatedEvents.length === 0) {
      response.status(400).json({
        message: "Could not create any Events",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${successfullyCreatedEvents.length} Events. ${
        eventFields.length - successfullyCreatedEvents.length
      } Events failed to be created.`,
      resourceData: successfullyCreatedEvents,
    });
  }
);

export {
  createNewEventController,
  getQueriedEventsController,
  getEventsByUserController,
  getEventByIdController,
  deleteEventController,
  deleteAllEventsController,
  updateEventByIdController,
  createNewEventsBulkController,
  updateEventsBulkController,
};
