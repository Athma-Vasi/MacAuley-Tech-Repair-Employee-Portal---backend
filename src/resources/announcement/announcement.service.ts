import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { AnnouncementDocument, AnnouncementSchema, RatingFeel } from './announcement.model';
import type { DatabaseResponse, DatabaseResponseNullable } from '../../types';

import { AnnouncementModel } from './announcement.model';

type CheckAnnouncementExistsServiceInput = {
  announcementId?: Types.ObjectId;
  title?: string;
  userId?: Types.ObjectId;
};

async function checkAnnouncementExistsService({
  announcementId,
  title,
  userId,
}: CheckAnnouncementExistsServiceInput): Promise<boolean> {
  try {
    // const announcement = await AnnouncementModel.findOne({
    //   $or: [{ _id: id }, { title }, { user }],
    // }).lean();

    if (announcementId) {
      const announcement = await AnnouncementModel.findById(announcementId).lean().exec();
      return announcement ? true : false;
    }

    if (title) {
      const announcement = await AnnouncementModel.find({ title }).lean().exec();
      return announcement.length > 0 ? true : false;
    }

    if (userId) {
      const announcement = await AnnouncementModel.findById(userId).lean().exec();
      return announcement ? true : false;
    }

    return false;
  } catch (error: any) {
    throw new Error(error, { cause: 'checkAnnouncementExistsService' });
  }
}

type CreateNewAnnouncementServiceInput = {
  userId: Types.ObjectId;
  title: string;
  username: string;
  imageSrc: string;
  imageAlt: string;
  article: Record<string, string[]>;
  timeToRead: number;
  rating: {
    feel: RatingFeel;
    count: number;
  };
};

async function createNewAnnouncementService({
  userId,
  title,
  username,
  imageSrc,
  imageAlt,
  article,
  timeToRead,
  rating,
}: CreateNewAnnouncementServiceInput) {
  try {
    const newAnnouncementObject = {
      userId,
      title,
      username,
      imageSrc,
      imageAlt,
      article,
      timeToRead,
      rating,
    };

    const newAnnouncement = await AnnouncementModel.create(newAnnouncementObject);

    return newAnnouncement;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewAnnouncementService' });
  }
}

async function deleteAnnouncementService(
  id: Types.ObjectId
): DatabaseResponseNullable<AnnouncementSchema> {
  try {
    const result = await AnnouncementModel.findByIdAndDelete(id).lean().exec();
    return result;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAnnouncementService' });
  }
}

async function getAnnouncementsByUserService(
  user: Types.ObjectId
): DatabaseResponse<AnnouncementSchema> {
  try {
    const announcements = await AnnouncementModel.find({ user }).lean().exec();
    return announcements;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAnnouncementsByUserService' });
  }
}

type UpdateAnnouncementServiceInput = {
  announcementId: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  username: string;
  imageSrc: string;
  imageAlt: string;
  article: Record<string, string[]>;
  timeToRead: number;
  rating: {
    feel: RatingFeel;
    count: number;
  };
};

async function updateAnnouncementService({
  announcementId,
  userId,
  title,
  username,
  imageSrc,
  imageAlt,
  article,
  timeToRead,
  rating,
}: UpdateAnnouncementServiceInput): DatabaseResponseNullable<AnnouncementSchema> {
  try {
    const announcementFieldsToUpdateObj = {
      userId,
      title,
      username,
      imageSrc,
      imageAlt,
      article,
      timeToRead,
      rating,
    };

    const announcement = await AnnouncementModel.findByIdAndUpdate(
      announcementId,
      announcementFieldsToUpdateObj,
      { new: true }
    )
      .lean()
      .exec();
    return announcement;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateAnnouncementService' });
  }
}

async function getAllAnnouncementsService(): DatabaseResponse<AnnouncementSchema> {
  try {
    const announcements = await AnnouncementModel.find({}).lean().exec();
    return announcements;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllAnnouncementsService' });
  }
}

async function deleteAllAnnouncementsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await AnnouncementModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllAnnouncementsService' });
  }
}

async function getAnnouncementByIdService(
  announcementId: Types.ObjectId
): DatabaseResponseNullable<AnnouncementSchema> {
  try {
    const announcement = await AnnouncementModel.findById(announcementId).lean().exec();
    return announcement;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAnnouncementByIdService' });
  }
}

export {
  checkAnnouncementExistsService,
  createNewAnnouncementService,
  deleteAnnouncementService,
  deleteAllAnnouncementsService,
  getAnnouncementsByUserService,
  updateAnnouncementService,
  getAllAnnouncementsService,
  getAnnouncementByIdService,
};
