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
  UpdateAnnouncementRatingRequest,
  CreateNewAnnouncementsBulkRequest,
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
  DatabaseResponseNullable,
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';
import {
  UserDocument,
  checkUserExistsService,
  getUserByIdService,
  updateUserByIdService,
} from '../../../user';

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
        bannerImageSrcCompressed,
        bannerImageAlt,
        bannerImageSrc,
        timeToRead,
        ratingResponse,
        ratedUserIds,
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
      bannerImageSrcCompressed,
      bannerImageAlt,
      bannerImageSrc,
      timeToRead,
      ratingResponse,
      ratedUserIds,
    };

    const newAnnouncement = await createNewAnnouncementService(newAnnouncementObject);
    if (!newAnnouncement) {
      response.status(400).json({ message: 'Announcement could not be created', resourceData: [] });
      return;
    }

    response.status(201).json({
      message: 'Announcement created successfully!',
      resourceData: [newAnnouncement],
    });
  }
);

// DEV ROUTE
// @desc   create new announcements in bulk
// @route  POST /announcements/dev
// @access Private/Manager/Admin
const createNewAnnouncementsBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewAnnouncementsBulkRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    const { announcements } = request.body;

    // create new announcements in bulk
    const newAnnouncements = await Promise.all(
      announcements.map(async (announcement) => {
        const {
          userId,
          username,
          title,
          author,
          article,
          bannerImageAlt,
          bannerImageSrc,
          bannerImageSrcCompressed,
          timeToRead,
          ratingResponse,
          ratedUserIds,
        } = announcement;

        // create new announcement object
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
          bannerImageSrcCompressed,
          timeToRead,
          ratingResponse,
          ratedUserIds,
        };

        // create new announcement
        const newAnnouncement = await createNewAnnouncementService(newAnnouncementObject);

        return newAnnouncement;
      })
    );

    // filter out undefined values
    const newAnnouncementsFiltered = newAnnouncements.filter(
      (announcement) => announcement
    ) as AnnouncementDocument[];

    // check if any announcements were created
    if (newAnnouncementsFiltered.length === announcements.length) {
      response.status(201).json({
        message: 'Announcements created successfully!',
        resourceData: newAnnouncementsFiltered,
      });
      return;
    } else {
      response.status(400).json({
        message: 'Announcements could not be created',
        resourceData: [],
      });
      return;
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

    if (!announcements?.length) {
      response.status(200).json({
        message: 'No announcements that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found announcements',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: announcements,
    });
  }
);

// @desc   get corresponding announcements for requesting user
// @route  GET /announcement/user
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

    if (!announcements?.length) {
      response.status(200).json({
        message: 'No announcements that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found announcements',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: announcements,
    });
  }
);

// @desc   update announcement
// @route  PATCH /announcement/:announcementId
// @access Private
const updateAnnouncementHandler = expressAsyncHandler(
  async (
    request: UpdateAnnouncementRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument>>
  ) => {
    const { announcementFields } = request.body;
    const { announcementId } = request.params;

    console.log({ announcementFields, announcementId });

    // check if announcement exists
    const isAnnouncement = await getAnnouncementByIdService(announcementId);
    if (!isAnnouncement) {
      response.status(400).json({ message: 'Announcement does not exist', resourceData: [] });
      return;
    }

    const updatedAnnouncement = await updateAnnouncementService({
      announcementId,
      announcementFields,
    });

    if (!updatedAnnouncement) {
      response.status(400).json({ message: 'Announcement could not be updated', resourceData: [] });
      return;
    }

    response.status(201).json({
      message: 'Announcement updated successfully',
      resourceData: [updatedAnnouncement],
    });
  }
);

// @desc   update announcement rating
// @route  PATCH /announcement/:announcementId/rating
// @access Private
const updateAnnouncementRatingHandler = expressAsyncHandler(
  async (
    request: UpdateAnnouncementRatingRequest,
    response: Response<ResourceRequestServerResponse<AnnouncementDocument | UserDocument>>
  ) => {
    const { announcementId } = request.params;
    const {
      announcementFields: { ratedUserIds, ratingResponse },
    } = request.body;

    // check if announcement exists
    const isAnnouncement = await getAnnouncementByIdService(announcementId);
    if (!isAnnouncement) {
      response.status(400).json({ message: 'Announcement does not exist', resourceData: [] });
      return;
    }

    const updatedAnnouncement = await updateAnnouncementService({
      announcementId,
      announcementFields: { ratedUserIds, ratingResponse },
    });
    if (!updatedAnnouncement) {
      response.status(400).json({ message: 'Announcement could not be updated', resourceData: [] });
      return;
    }

    response.status(201).json({
      message: 'Announcement rating updated successfully!',
      resourceData: [updatedAnnouncement],
    });
  }
);

// @desc   delete announcement
// @route  DELETE /announcement/:announcementId
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
    if (deletedAnnouncement.deletedCount === 0) {
      response.status(400).json({ message: 'Announcement could not be deleted', resourceData: [] });
      return;
    }

    response.status(201).json({
      message: 'Announcement deleted successfully',
      resourceData: [],
    });
  }
);

// @desc    Delete all announcements
// @route   DELETE /announcements
// @access  Private
const deleteAllAnnouncementsHandler = expressAsyncHandler(
  async (_request: DeleteAllAnnouncementsRequest, response: Response) => {
    // delete all announcements if all checks pass successfully
    const deletedResult: DeleteResult = await deleteAllAnnouncementsService();
    if (deletedResult.deletedCount === 0) {
      response.status(400).json({
        message: 'Announcements could not be deleted',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'All announcements deleted successfully',
      resourceData: [],
    });
  }
);

// @desc   get an announcement by its id
// @route  GET /announcement/:announcementId
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
    if (!announcement) {
      response.status(400).json({
        message: 'Announcement could not be retrieved',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Announcement retrieved successfully',
      resourceData: [announcement],
    });
  }
);

export {
  createNewAnnouncementHandler,
  createNewAnnouncementsBulkHandler,
  deleteAnnouncementHandler,
  deleteAllAnnouncementsHandler,
  getAnnouncementByIdHandler,
  getQueriedAnnouncementsHandler,
  getQueriedAnouncementsByUserHandler,
  updateAnnouncementHandler,
  updateAnnouncementRatingHandler,
};
