import type { FlattenMaps, Types } from 'mongoose';
import type { AnnouncementSchema, RatingFeel } from './announcement.model';

import { AnnouncementModel } from './announcement.model';

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
  userId,
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

    const announcement = await AnnouncementModel.findByIdAndUpdate(
      userId,
      announcementFieldsToUpdateObj,
      { new: true }
    )
      .lean()
      .exec();
    if (announcement) {
      return announcement;
    } else {
      const newAnnouncement = await AnnouncementModel.create(announcementFieldsToUpdateObj);
      return newAnnouncement;
    }
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
