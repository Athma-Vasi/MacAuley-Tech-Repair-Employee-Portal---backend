import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  CreateNewAnnouncementRequest,
  DeleteAnAnnouncementRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsByUserRequest,
  DeleteAllAnnouncementsRequest,
  GetAnAnnouncementRequest,
  AnnouncementsServerResponse,
} from './announcement.types';

import {
  checkAnnouncementExistsService,
  createNewAnnouncementService,
  deleteAllAnnouncementsService,
  deleteAnnouncementService,
  getAllAnnouncementsService,
  getAnnouncementByIdService,
  getAnnouncementsByUserService,
  updateAnnouncementService,
} from './announcement.service';
import { getUserByIdService } from '../user';

// @desc   create new announcement
// @route  POST /announcements
// @access Public
const getAllAnnouncementsHandler = expressAsyncHandler(
  async (request: GetAllAnnouncementsRequest, response: Response) => {
    const {
      userInfo: { userId },
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', announcementData: [] });
      return;
    }

    const announcements = await getAllAnnouncementsService();

    if (announcements.length === 0) {
      response.status(404).json({
        message: 'No announcements found',
        announcementData: [],
      });
    } else {
      response.status(200).json({
        message: 'Announcements found successfully',
        announcementData: announcements,
      });
    }

    // // add username to each announcement before sending response
    // const announcementsWithUsername = await Promise.all(
    //   announcements.map(async (announcement) => {
    //     const user = await getUserByIdService(announcement.userId);

    //     if (!user) {
    //       return { ...announcement, username: 'unknown' };
    //     }

    //     return { ...announcement, username: user?.username };
    //   })
    // );

    // response.status(200).json({
    //   message: 'Announcements found successfully',
    //   announcementData: announcementsWithUsername,
    // });
  }
);

// @desc   get corresponding announcements for requesting user
// @route  GET /announcements/user
// @access Private
const getAnnouncementsByUserHandler = expressAsyncHandler(
  async (request: GetAnnouncementsByUserRequest, response: Response) => {
    const {
      userInfo: { userId },
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', announcementData: [] });
      return;
    }

    const announcements = await getAnnouncementsByUserService(userId);
    if (announcements.length === 0) {
      response.status(400).json({ message: 'No announcements found', announcementData: [] });
      return;
    }

    // // add username to each announcement before sending response
    // const announcementsWithUsername = await Promise.all(
    //   announcements.map(async (announcement) => {
    //     const user = await getUserByIdService(announcement.userId);

    //     if (!user) {
    //       return { ...announcement, username: 'unknown' };
    //     }

    //     return { ...announcement, username: user?.username };
    //   })
    // );

    // response.status(200).json({
    //   message: 'Announcements found successfully',
    //   announcementData: announcementsWithUsername,
    // });

    response.status(200).json({
      message: 'Announcements found successfully',
      announcementData: announcements,
    });
  }
);

// @desc   create new announcement
// @route  POST /announcements
// @access Private
const createNewAnnouncementHandler = expressAsyncHandler(
  async (request: CreateNewAnnouncementRequest, response: Response) => {
    const {
      userInfo: { userId, username },
      title,
      article,
      imageAlt,
      imageSrc,
      rating,
      timeToRead,
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', announcementData: [] });
      return;
    }

    // check if announcement with same title already exists
    const isDuplicateAnnouncement = await checkAnnouncementExistsService({ title });
    if (isDuplicateAnnouncement) {
      response
        .status(400)
        .json({ message: 'Announcement with same title already exists', announcementData: [] });
      return;
    }

    // create new announcement if all checks pass successfully
    const newAnnouncementObject = {
      userId,
      username,
      title,
      article,
      imageAlt,
      imageSrc,
      rating,
      timeToRead,
    };
    const newAnnouncement = await createNewAnnouncementService(newAnnouncementObject);
    if (newAnnouncement) {
      response.status(201).json({
        message: 'Announcement created successfully',
        announcementData: [newAnnouncement],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Announcement could not be created', announcementData: [] });
    }
  }
);

// @desc   update announcement
// @route  PUT /announcements/:announcementId
// @access Private
const updateAnnouncementHandler = expressAsyncHandler(
  async (request: UpdateAnnouncementRequest, response: Response) => {
    const {
      userInfo: { userId, username, roles },
      title,
      article,
      imageAlt,
      imageSrc,
      rating,
      timeToRead,
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', announcementData: [] });
      return;
    }

    const { announcementId } = request.params;

    // only managers/admin can update announcements
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can update announcements',
        announcementData: [],
      });
      return;
    }

    const updateAnnouncementObject = {
      announcementId,
      userId,
      username,
      title,
      article,
      imageAlt,
      imageSrc,
      rating,
      timeToRead,
    };

    // check if announcement exists
    const isAnnouncement = await getAnnouncementByIdService(announcementId);
    if (!isAnnouncement) {
      response.status(400).json({ message: 'Announcement does not exist', announcementData: [] });
      return;
    }

    // as it is a PUT request, announcement is created if it does not exist
    const updatedAnnouncement = await updateAnnouncementService(updateAnnouncementObject);
    if (updatedAnnouncement) {
      response.status(201).json({
        message: 'Announcement updated successfully',
        announcementData: [updatedAnnouncement],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Announcement could not be updated', announcementData: [] });
    }
  }
);

// @desc   delete announcement
// @route  DELETE /announcements/:announcementId
// @access Private
const deleteAnnouncementHandler = expressAsyncHandler(
  async (request: DeleteAnAnnouncementRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', announcementData: [] });
      return;
    }

    // only managers/admin can delete announcements
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can delete announcements',
        announcementData: [],
      });
      return;
    }

    const { announcementId } = request.params;

    // check if announcement exists
    const isAnnouncement = await checkAnnouncementExistsService({ announcementId });
    if (!isAnnouncement) {
      response.status(400).json({ message: 'Announcement does not exist', announcementData: [] });
      return;
    }

    // delete announcement if all checks pass successfully
    const deletedAnnouncement = await deleteAnnouncementService(announcementId);
    if (deletedAnnouncement) {
      response.status(201).json({
        message: 'Announcement deleted successfully',
        announcementData: [deletedAnnouncement],
      });
    } else {
      response
        .status(400)
        .json({ message: 'Announcement could not be deleted', announcementData: [] });
    }
  }
);

// @desc    Delete all announcements
// @route   DELETE /announcements
// @access  Private
const deleteAllAnnouncementsHandler = expressAsyncHandler(
  async (request: DeleteAllAnnouncementsRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', announcementData: [] });
      return;
    }

    // only managers/admin can delete all announcements
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can delete all announcements',
        announcementData: [],
      });
      return;
    }

    // delete all announcements if all checks pass successfully
    const deletedResult = await deleteAllAnnouncementsService();
    if (deletedResult.acknowledged) {
      response.status(200).json({
        message: 'All announcements deleted successfully',
        announcementData: [],
      });
    } else {
      response.status(400).json({
        message: 'Announcements could not be deleted',
        announcementData: [],
      });
    }
  }
);

// @desc   get an announcement by its id
// @route  GET /announcements/:announcementId
// @access Private
const getAnnouncementByIdHandler = expressAsyncHandler(
  async (request: GetAnAnnouncementRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
      announcementId,
    } = request.body;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist', announcementData: [] });
      return;
    }

    // only managers/admin can get an announcement by its id
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers and admins can request an announcement by its id',
        announcementData: [],
      });
      return;
    }

    // check if announcement exists
    const isAnnouncement = await checkAnnouncementExistsService({ announcementId });
    if (!isAnnouncement) {
      response.status(404).json({
        message: 'Announcement does not exist',
        announcementData: [],
      });
      return;
    }

    // get announcement if all checks pass successfully
    const announcement = await getAnnouncementByIdService(announcementId);
    if (announcement) {
      response.status(200).json({
        message: 'Announcement retrieved successfully',
        announcementData: [announcement],
      });
    } else {
      response.status(400).json({
        message: 'Announcement could not be retrieved',
        announcementData: [],
      });
    }
  }
);

export {
  deleteAnnouncementHandler,
  getAllAnnouncementsHandler,
  getAnnouncementsByUserHandler,
  createNewAnnouncementHandler,
  updateAnnouncementHandler,
  deleteAllAnnouncementsHandler,
  getAnnouncementByIdHandler,
};
