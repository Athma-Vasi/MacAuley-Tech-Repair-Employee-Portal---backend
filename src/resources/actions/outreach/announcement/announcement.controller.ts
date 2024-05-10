import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
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
import createHttpError from "http-errors";

// @desc   Create a new announcement
// @route  POST api/v1/actions/outreach/announcement
// @access Private
const createNewAnnouncementController = expressAsyncController(
  async (
    request: CreateNewAnnouncementRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>,
    next: NextFunction
  ) => {
    const { announcementSchema } = request.body;

    const announcementDocument = await createNewAnnouncementService(announcementSchema);
    if (!announcementDocument) {
      return next(
        new createHttpError.InternalServerError("Announcement creation failed")
      );
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
const getQueriedAnnouncementsController = expressAsyncController(
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
const getAnnouncementsByUserController = expressAsyncController(
  async (
    request: GetQueriedAnnouncementsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AnnouncementDocument>>
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
      totalDocuments = await getQueriedTotalAnnouncementsService({
        filter: filterWithUserId,
      });
    }

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
const updateAnnouncementByIdController = expressAsyncController(
  async (
    request: UpdateAnnouncementByIdRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>,
    next: NextFunction
  ) => {
    const { announcementId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      return next(
        new createHttpError.NotFound("User not found, announcement update failed")
      );
    }

    const updatedAnnouncement = await updateAnnouncementByIdService({
      _id: announcementId,
      fields,
      updateOperator,
    });
    if (!updatedAnnouncement) {
      return next(
        new createHttpError.InternalServerError(
          "Announcement request status update failed"
        )
      );
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
const getAnnouncementByIdController = expressAsyncController(
  async (
    request: GetAnnouncementByIdRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>,
    next: NextFunction
  ) => {
    const { announcementId } = request.params;
    const announcement = await getAnnouncementByIdService(announcementId);
    if (!announcement) {
      return next(new createHttpError.NotFound("Announcement request not found"));
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
const deleteAnnouncementController = expressAsyncController(
  async (request: DeleteAnnouncementRequest, response: Response, next: NextFunction) => {
    const { announcementId } = request.params;

    const deletedResult: DeleteResult = await deleteAnnouncementByIdService(
      announcementId
    );
    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError("Announcement request deletion failed")
      );
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
const deleteAllAnnouncementsController = expressAsyncController(
  async (
    _request: DeleteAllAnnouncementsRequest,
    response: Response,
    next: NextFunction
  ) => {
    const deletedResult: DeleteResult = await deleteAllAnnouncementsService();
    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError("Announcement requests deletion failed")
      );
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
const createNewAnnouncementsBulkController = expressAsyncController(
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

    const filteredAnnouncementDocuments = announcementDocuments.filter(
      removeUndefinedAndNullValues
    );

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
const updateAnnouncementsBulkController = expressAsyncController(
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
  createNewAnnouncementController,
  getQueriedAnnouncementsController,
  getAnnouncementsByUserController,
  getAnnouncementByIdController,
  deleteAnnouncementController,
  deleteAllAnnouncementsController,
  updateAnnouncementByIdController,
  createNewAnnouncementsBulkController,
  updateAnnouncementsBulkController,
};
