import expressAsyncHandler from 'express-async-handler';

import type { DeleteResult } from 'mongodb';
import type { Response } from 'express';
import type {
  CreateNewAnnouncementRequest,
  DeleteAnAnnouncementRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsByUserRequest,
  DeleteAllAnnouncementsRequest,
  GetAnnouncementRequestById,
} from './announcement.types';

import {
  checkAnnouncementExistsService,
  createNewAnnouncementService,
  deleteAllAnnouncementsService,
  deleteAnnouncementService,
  getQueriedAnnouncementsService,
  getAnnouncementByIdService,
  getQueriedAnouncementsByUserService,
  updateAnnouncementService,
  getQueriedTotalAnnouncementsService,
} from './announcement.service';
import { AnnouncementDocument, AnnouncementSchema } from './announcement.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';

// @desc   create new announcement
// @route  POST /announcements
// @access Private
const createNewAnnouncementHandler = expressAsyncHandler(
  async (
    request: CreateNewAnnouncementRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      announcement: {
        title,
        author,
        article,
        bannerImageAlt,
        bannerImageSrc,
        timeToRead,
        commentIds,
        ratingResponse,
      },
    } = request.body;

    // check if announcement with same title already exists
    const isDuplicateAnnouncement = await checkAnnouncementExistsService({ title });
    if (isDuplicateAnnouncement) {
      response
        .status(400)
        .json({ message: 'Announcement with same title already exists', resourceData: [] });
      return;
    }

    // create new announcement if all checks pass successfully
    const newAnnouncementObject: AnnouncementSchema = {
      userId,
      username,
      action: 'outreach',
      category: 'announcement',
      title,
      author,
      article,
      bannerImageAlt,
      bannerImageSrc,
      timeToRead,
      commentIds,
      ratingResponse,
    };

    const newAnnouncement = await createNewAnnouncementService(newAnnouncementObject);
    if (newAnnouncement) {
      response.status(201).json({
        message: 'Announcement created successfully!',
        resourceData: [newAnnouncement],
      });
    } else {
      response.status(400).json({ message: 'Announcement could not be created', resourceData: [] });
    }
  }
);

// @desc   create new announcement
// @route  POST /announcements
// @access Public
const getQueriedAnnouncementsHandler = expressAsyncHandler(
  async (
    request: GetAllAnnouncementsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalAnnouncementsService({
        filter: filter as FilterQuery<AnnouncementDocument> | undefined,
      });
    }

    // get all announcements
    const announcements = await getQueriedAnnouncementsService({
      filter: filter as FilterQuery<AnnouncementDocument> | undefined,
      projection: projection as QueryOptions<AnnouncementDocument>,
      options: options as QueryOptions<AnnouncementDocument>,
    });
    if (announcements.length === 0) {
      response.status(404).json({
        message: 'No announcements that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found announcements',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: announcements,
      });
    }
  }
);

// @desc   get corresponding announcements for requesting user
// @route  GET /announcements/user
// @access Private
const getQueriedAnouncementsByUserHandler = expressAsyncHandler(
  async (
    request: GetAnnouncementsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // assign userId to filter
    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalAnnouncementsService({
        filter: filterWithUserId,
      });
    }

    // get all announcements by an user
    const announcements = await getQueriedAnouncementsByUserService({
      filter: filterWithUserId as FilterQuery<AnnouncementDocument> | undefined,
      projection: projection as QueryOptions<AnnouncementDocument>,
      options: options as QueryOptions<AnnouncementDocument>,
    });
    if (announcements.length === 0) {
      response.status(404).json({
        message: 'No announcements that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found announcements',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: announcements,
      });
    }
  }
);

// @desc   update announcement
// @route  PUT /announcements/:announcementId
// @access Private
const updateAnnouncementHandler = expressAsyncHandler(
  async (
    request: UpdateAnnouncementRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      announcementField,
    } = request.body;
    const { announcementId } = request.params;

    // check if announcement exists
    const isAnnouncement = await getAnnouncementByIdService(announcementId);
    if (!isAnnouncement) {
      response.status(400).json({ message: 'Announcement does not exist', resourceData: [] });
      return;
    }

    const updatedAnnouncement = await updateAnnouncementService({
      announcementId,
      announcementField,
    });
    if (updatedAnnouncement) {
      response.status(201).json({
        message: 'Announcement updated successfully',
        resourceData: [updatedAnnouncement],
      });
    } else {
      response.status(400).json({ message: 'Announcement could not be updated', resourceData: [] });
    }
  }
);

// @desc   delete announcement
// @route  DELETE /announcements/:announcementId
// @access Private
const deleteAnnouncementHandler = expressAsyncHandler(
  async (
    request: DeleteAnAnnouncementRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    const { announcementId } = request.params;

    // check if announcement exists
    const isAnnouncement = await checkAnnouncementExistsService({ announcementId });
    if (!isAnnouncement) {
      response.status(400).json({ message: 'Announcement does not exist', resourceData: [] });
      return;
    }

    // delete announcement if all checks pass successfully
    const deletedAnnouncement: DeleteResult = await deleteAnnouncementService(announcementId);
    if (deletedAnnouncement.deletedCount === 1) {
      response.status(201).json({
        message: 'Announcement deleted successfully',
        resourceData: [],
      });
    } else {
      response.status(400).json({ message: 'Announcement could not be deleted', resourceData: [] });
    }
  }
);

// @desc    Delete all announcements
// @route   DELETE /announcements
// @access  Private
const deleteAllAnnouncementsHandler = expressAsyncHandler(
  async (request: DeleteAllAnnouncementsRequest, response: Response) => {
    // delete all announcements if all checks pass successfully
    const deletedResult: DeleteResult = await deleteAllAnnouncementsService();
    if (deletedResult.deletedCount > 0) {
      response.status(200).json({
        message: 'All announcements deleted successfully',
        resourceData: [],
      });
    } else {
      response.status(400).json({
        message: 'Announcements could not be deleted',
        resourceData: [],
      });
    }
  }
);

// @desc   get an announcement by its id
// @route  GET /announcements/:announcementId
// @access Private
const getAnnouncementByIdHandler = expressAsyncHandler(
  async (
    request: GetAnnouncementRequestById,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    const { announcementId } = request.params;

    // check if announcement exists
    const isAnnouncement = await checkAnnouncementExistsService({ announcementId });
    if (!isAnnouncement) {
      response.status(404).json({
        message: 'Announcement does not exist',
        resourceData: [],
      });
      return;
    }

    // get announcement if all checks pass successfully
    const announcement = await getAnnouncementByIdService(announcementId);
    if (announcement) {
      response.status(200).json({
        message: 'Announcement retrieved successfully',
        resourceData: [announcement],
      });
    } else {
      response.status(400).json({
        message: 'Announcement could not be retrieved',
        resourceData: [],
      });
    }
  }
);

export {
  deleteAnnouncementHandler,
  getQueriedAnnouncementsHandler,
  getQueriedAnouncementsByUserHandler,
  createNewAnnouncementHandler,
  updateAnnouncementHandler,
  deleteAllAnnouncementsHandler,
  getAnnouncementByIdHandler,
};
