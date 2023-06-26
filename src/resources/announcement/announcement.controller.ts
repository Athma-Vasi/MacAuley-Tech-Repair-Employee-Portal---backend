import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  CreateNewAnnouncementRequest,
  DeleteAnnouncementRequest,
  GetAllAnnouncementsRequest,
  UpdateAnnouncementRequest,
  GetAnnouncementsFromUserIdRequest,
} from './announcement.types';

import {
  checkAnnouncementExistsService,
  createNewAnnouncementService,
  deleteAnnouncementService,
  getAllAnnouncementsService,
  getAnnouncementsByUserService,
  updateAnnouncementService,
} from './announcement.service';
import { getUserByIdService } from '../user';

// @desc   create new announcement
// @route  POST /announcement
// @access Public
const getAllAnnouncementsHandler = expressAsyncHandler(
  async (request: GetAllAnnouncementsRequest, response: Response) => {
    const announcements = await getAllAnnouncementsService();

    // add username to each announcement before sending response
    const announcementsWithUsername = await Promise.all(
      announcements.map(async (announcement) => {
        const user = await getUserByIdService(announcement.userId);

        if (!user) {
          return { ...announcement, username: 'unknown' };
        }

        return { ...announcement, username: user?.username };
      })
    );

    response.status(200).json({
      message: 'Announcements found successfully',
      announcements: announcementsWithUsername,
    });
  }
);

// @desc   get announcements from an user by their user id
// @route  GET /announcement/:userId
// @access Private
const getAnnouncementsByUserHandler = expressAsyncHandler(
  async (request: GetAnnouncementsFromUserIdRequest, response: Response) => {
    const { userId } = request.params;

    // check if user exists
    const isUser = await getUserByIdService(userId);
    if (!isUser) {
      response.status(400).json({ message: 'User does not exist' });
      return;
    }

    const announcements = await getAnnouncementsByUserService(userId);
    if (announcements.length === 0) {
      response.status(400).json({ message: 'No announcements found', announcements: [] });
      return;
    }

    // add username to each announcement before sending response
    const announcementsWithUsername = await Promise.all(
      announcements.map(async (announcement) => {
        const user = await getUserByIdService(announcement.userId);

        if (!user) {
          return { ...announcement, username: 'unknown' };
        }

        return { ...announcement, username: user?.username };
      })
    );

    response.status(200).json({
      message: 'Announcements found successfully',
      announcements: announcementsWithUsername,
    });
  }
);

// @desc   create new announcement
// @route  POST /announcement
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
      response.status(400).json({ message: 'User does not exist' });
      return;
    }

    // check if announcement with same title already exists
    const isDuplicateAnnouncement = await checkAnnouncementExistsService({ title });
    if (isDuplicateAnnouncement) {
      response.status(400).json({ message: 'Announcement with same title already exists' });
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
      response.status(201).json({ message: 'Announcement created successfully', newAnnouncement });
    } else {
      response.status(400).json({ message: 'Announcement could not be created' });
    }
  }
);

// @desc   update announcement
// @route  PUT /announcements/:id
// @access Private
const updateAnnouncementHandler = expressAsyncHandler(
  async (request: UpdateAnnouncementRequest, response: Response) => {
    const {
      userInfo: { userId, username },
      title,
      article,
      imageAlt,
      imageSrc,
      rating,
      timeToRead,
    } = request.body;

    const updateAnnouncementObject = {
      userId,
      username,
      title,
      article,
      imageAlt,
      imageSrc,
      rating,
      timeToRead,
    };
    const updatedAnnouncement = await updateAnnouncementService(updateAnnouncementObject);
    if (updatedAnnouncement) {
      response
        .status(201)
        .json({ message: 'Announcement updated successfully', updatedAnnouncement });
    } else {
      response.status(400).json({ message: 'Announcement could not be updated' });
    }
  }
);

// @desc   delete announcement
// @route  DELETE /announcements/:id
// @access Private
const deleteAnnouncementHandler = expressAsyncHandler(
  async (request: DeleteAnnouncementRequest, response: Response) => {
    const { id } = request.params;

    // check if announcement exists
    const isAnnouncement = await checkAnnouncementExistsService({ id });
    if (!isAnnouncement) {
      response.status(400).json({ message: 'Announcement does not exist' });
      return;
    }

    // delete announcement if all checks pass successfully
    const deletedAnnouncement = await deleteAnnouncementService(id);
    if (deletedAnnouncement) {
      response
        .status(201)
        .json({ message: 'Announcement deleted successfully', deletedAnnouncement });
    } else {
      response.status(400).json({ message: 'Announcement could not be deleted' });
    }
  }
);

export {
  deleteAnnouncementHandler,
  getAllAnnouncementsHandler,
  getAnnouncementsByUserHandler,
  createNewAnnouncementHandler,
  updateAnnouncementHandler,
};
