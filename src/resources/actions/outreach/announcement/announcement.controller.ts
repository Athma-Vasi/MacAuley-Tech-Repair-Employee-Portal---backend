import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewAnnouncementRequest,
  CreateNewAnnouncementsBulkRequest,
  DeleteAllAnnouncementsRequest,
  DeleteAnnouncementRequest,
  GetAnnouncementByIdRequest,
  GetQueriedAnnouncementsByUserRequest,
  GetQueriedAnnouncementsRequest,
  UpdateAnnouncementByIdRequest,
  UpdateAnnouncementsBulkRequest,
} from "./announcement.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import type { AnnouncementDocument } from "./announcement.model";

import {
  createNewAnnouncementService,
  deleteAllAnnouncementsService,
  deleteAnnouncementByIdService,
  getAnnouncementByIdService,
  getQueriedAnnouncementsByUserService,
  getQueriedAnnouncementsService,
  getQueriedTotalAnnouncementsService,
  updateAnnouncementByIdService,
} from "./announcement.service";
import { removeUndefinedAndNullValues } from "../../../../utils";
import { getUserByIdService } from "../../../user";

// @desc   Create a new announcement
// @route  POST api/v1/actions/outreach/announcement
// @access Private
const createNewAnnouncementHandler = expressAsyncHandler(
  async (
    request: CreateNewAnnouncementRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    const { announcementSchema } = request.body;

    const announcementDocument = await createNewAnnouncementService(announcementSchema);

    if (!announcementDocument) {
      response.status(400).json({
        message: "New announcement could not be created",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: "Successfully created announcement",
      resourceData: [announcementDocument],
    });
  }
);

// @desc   Get all announcements
// @route  GET api/v1/actions/outreach/announcement
// @access Private/Admin/Manager
const getQueriedAnnouncementsHandler = expressAsyncHandler(
  async (
    request: GetQueriedAnnouncementsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalAnnouncementsService({
        filter: filter as FilterQuery<AnnouncementDocument> | undefined,
      });
    }

    // get all announcements
    const announcement = await getQueriedAnnouncementsService({
      filter: filter as FilterQuery<AnnouncementDocument> | undefined,
      projection: projection as QueryOptions<AnnouncementDocument>,
      options: options as QueryOptions<AnnouncementDocument>,
    });

    if (!announcement.length) {
      response.status(200).json({
        message: "No announcements that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Announcements found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: announcement,
    });
  }
);

// @desc   Get all announcement requests by user
// @route  GET api/v1/actions/outreach/announcement
// @access Private
const getAnnouncementsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedAnnouncementsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    // anyone can view their own announcement requests
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // assign userId to filter
    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalAnnouncementsService({
        filter: filterWithUserId,
      });
    }

    // get all announcement requests by user
    const announcements = await getQueriedAnnouncementsByUserService({
      filter: filterWithUserId as FilterQuery<AnnouncementDocument> | undefined,
      projection: projection as QueryOptions<AnnouncementDocument>,
      options: options as QueryOptions<AnnouncementDocument>,
    });

    if (!announcements.length) {
      response.status(200).json({
        message: "No announcement requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Announcement requests found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: announcements,
    });
  }
);

// @desc   Update announcement status
// @route  PATCH api/v1/actions/outreach/announcement
// @access Private/Admin/Manager
const updateAnnouncementByIdHandler = expressAsyncHandler(
  async (
    request: UpdateAnnouncementByIdRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    const { announcementId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: "User does not exist", resourceData: [] });
      return;
    }

    // update announcement request status
    const updatedAnnouncement = await updateAnnouncementByIdService({
      _id: announcementId,
      fields,
      updateOperator,
    });

    if (!updatedAnnouncement) {
      response.status(400).json({
        message: "Announcement request status update failed. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Announcement request status updated successfully",
      resourceData: [updatedAnnouncement],
    });
  }
);

// @desc   Get an announcement request
// @route  GET api/v1/actions/outreach/announcement
// @access Private
const getAnnouncementByIdHandler = expressAsyncHandler(
  async (
    request: GetAnnouncementByIdRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    const { announcementId } = request.params;
    const announcement = await getAnnouncementByIdService(announcementId);
    if (!announcement) {
      response
        .status(404)
        .json({ message: "Announcement request not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "Announcement request found successfully",
      resourceData: [announcement],
    });
  }
);

// @desc   Delete an announcement request by its id
// @route  DELETE api/v1/actions/outreach/announcement
// @access Private
const deleteAnnouncementHandler = expressAsyncHandler(
  async (request: DeleteAnnouncementRequest, response: Response) => {
    const { announcementId } = request.params;

    // delete announcement request by id
    const deletedResult: DeleteResult = await deleteAnnouncementByIdService(
      announcementId
    );

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "Announcement request could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Announcement request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all announcement requests
// @route   DELETE api/v1/actions/outreach/request-resource/announcement
// @access  Private
const deleteAllAnnouncementsHandler = expressAsyncHandler(
  async (_request: DeleteAllAnnouncementsRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllAnnouncementsService();

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "All announcement requests could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "All announcement requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new announcement requests in bulk
// @route  POST api/v1/actions/outreach/announcement
// @access Private
const createNewAnnouncementsBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewAnnouncementsBulkRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    const { announcementSchemas } = request.body;

    const announcementDocuments = await Promise.all(
      announcementSchemas.map(async (announcementSchema) => {
        const announcementDocument = await createNewAnnouncementService(
          announcementSchema
        );
        return announcementDocument;
      })
    );

    // filter out any null documents
    const filteredAnnouncementDocuments = announcementDocuments.filter(
      removeUndefinedAndNullValues
    );

    // check if any documents were created
    if (filteredAnnouncementDocuments.length === 0) {
      response.status(400).json({
        message: "Announcement requests creation failed",
        resourceData: [],
      });
      return;
    }

    const uncreatedDocumentsAmount =
      announcementSchemas.length - filteredAnnouncementDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredAnnouncementDocuments.length
      } Announcement requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredAnnouncementDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update Announcements in bulk
// @route  PATCH api/v1/actions/outreach/announcement
// @access Private
const updateAnnouncementsBulkHandler = expressAsyncHandler(
  async (
    request: UpdateAnnouncementsBulkRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    const { announcementFields } = request.body;

    const updatedAnnouncements = await Promise.all(
      announcementFields.map(async (announcementField) => {
        const {
          documentUpdate: { fields, updateOperator },
          announcementId,
        } = announcementField;

        const updatedAnnouncement = await updateAnnouncementByIdService({
          _id: announcementId,
          fields,
          updateOperator,
        });

        return updatedAnnouncement;
      })
    );

    // filter out any announcements that were not created
    const successfullyCreatedAnnouncements = updatedAnnouncements.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedAnnouncements.length === 0) {
      response.status(400).json({
        message: "Could not create any Announcements",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedAnnouncements.length
      } Announcements. ${
        announcementFields.length - successfullyCreatedAnnouncements.length
      } Announcements failed to be created.`,
      resourceData: successfullyCreatedAnnouncements,
    });
  }
);

export {
  createNewAnnouncementHandler,
  getQueriedAnnouncementsHandler,
  getAnnouncementsByUserHandler,
  getAnnouncementByIdHandler,
  deleteAnnouncementHandler,
  deleteAllAnnouncementsHandler,
  updateAnnouncementByIdHandler,
  createNewAnnouncementsBulkHandler,
  updateAnnouncementsBulkHandler,
};
