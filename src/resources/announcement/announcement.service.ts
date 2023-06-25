import type { FlattenMaps, Types } from 'mongoose';
import type { AnnouncementSchema, RatingFeel } from './index';

import { AnnouncementModel } from './index';

type CheckAnnouncementExistsServiceInput = {
  id?: Types.ObjectId;
  title?: string;
  user?: Types.ObjectId;
};

async function checkAnnouncementExistsService({
  id,
  title,
  user,
}: CheckAnnouncementExistsServiceInput): Promise<boolean> {
  try {
    const announcement = await AnnouncementModel.findOne({
      $or: [{ _id: id }, { title }, { user }],
    }).lean();

    return announcement ? true : false;
  } catch (error: any) {
    throw new Error(error, { cause: 'checkAnnouncementExistsService' });
  }
}

type CreateNewAnnouncementServiceInput = {
  user: Types.ObjectId;
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
  user,
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
      user,
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

async function deleteAnnouncementService(id: Types.ObjectId): Promise<
  | (FlattenMaps<AnnouncementSchema> & {
      _id: Types.ObjectId;
    })
  | null
> {
  try {
    const result = await AnnouncementModel.findByIdAndDelete(id).lean().exec();
    return result;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAnnouncementService' });
  }
}

async function getAnnouncementsByUserService(user: Types.ObjectId): Promise<
  (FlattenMaps<AnnouncementSchema> & {
    _id: Types.ObjectId;
  })[]
> {
  try {
    const announcements = await AnnouncementModel.find({ user }).lean().exec();
    return announcements;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAnnouncementsByUserService' });
  }
}

type UpdateAnnouncementServiceInput = {
  id: Types.ObjectId;
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
  id,
  title,
  username,
  imageSrc,
  imageAlt,
  article,
  timeToRead,
  rating,
}: UpdateAnnouncementServiceInput) {
  try {
    const announcementFieldsToUpdateObj = {
      title,
      username,
      imageSrc,
      imageAlt,
      article,
      timeToRead,
      rating,
    };

    const announcements = await AnnouncementModel.findByIdAndUpdate(
      id,
      announcementFieldsToUpdateObj,
      { new: true }
    )
      .lean()
      .exec();

    return announcements;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateAnnouncementService' });
  }
}

async function getAllAnnouncementsService(): Promise<
  (FlattenMaps<AnnouncementSchema> & {
    _id: Types.ObjectId;
  })[]
> {
  try {
    const announcements = await AnnouncementModel.find({}).lean().exec();
    return announcements;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllAnnouncementsService' });
  }
}

export {
  checkAnnouncementExistsService,
  createNewAnnouncementService,
  deleteAnnouncementService,
  getAnnouncementsByUserService,
  updateAnnouncementService,
  getAllAnnouncementsService,
};
