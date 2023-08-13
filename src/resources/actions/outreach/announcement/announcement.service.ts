import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { AnnouncementDocument, AnnouncementSchema } from './announcement.model';
import type {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
} from '../../../../types';

import { AnnouncementModel } from './announcement.model';

type CheckAnnouncementExistsServiceInput = {
  announcementId?: Types.ObjectId | string;
  title?: string;
  userId?: Types.ObjectId | string;
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

async function createNewAnnouncementService(
  input: AnnouncementSchema
): Promise<AnnouncementDocument> {
  try {
    const newAnnouncement = await AnnouncementModel.create(input);
    return newAnnouncement;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewAnnouncementService' });
  }
}

async function getQueriedAnnouncementsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<AnnouncementDocument>): DatabaseResponse<AnnouncementDocument> {
  try {
    const announcements = await AnnouncementModel.find(filter, projection, options).lean().exec();
    return announcements;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedAnnouncementsService' });
  }
}

async function getQueriedTotalAnnouncementsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<AnnouncementDocument>): Promise<number> {
  try {
    const totalAnnouncements = await AnnouncementModel.countDocuments(filter).lean().exec();
    return totalAnnouncements;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalAnnouncementsService' });
  }
}

async function getQueriedAnouncementsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<AnnouncementDocument>): DatabaseResponse<AnnouncementDocument> {
  try {
    const announcements = await AnnouncementModel.find(filter, projection, options).lean().exec();
    return announcements;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedAnouncementsByUserService' });
  }
}

async function deleteAnnouncementService(id: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const result = await AnnouncementModel.deleteOne({
      _id: id,
    })
      .lean()
      .exec();
    return result;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAnnouncementService' });
  }
}

async function updateAnnouncementService({
  announcementField,
  announcementId,
}: {
  announcementField: Partial<AnnouncementSchema>;
  announcementId: string | Types.ObjectId;
}): DatabaseResponseNullable<AnnouncementDocument> {
  try {
    const announcement = await AnnouncementModel.findByIdAndUpdate(
      announcementId,
      { ...announcementField },
      { new: true }
    )
      .select('-__v')
      .lean()
      .exec();
    return announcement;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateAnnouncementService' });
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
  announcementId: Types.ObjectId | string
): DatabaseResponseNullable<AnnouncementDocument> {
  try {
    const announcement = await AnnouncementModel.findById(announcementId)
      .select('-__v')
      .lean()
      .exec();
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
  getQueriedTotalAnnouncementsService,
  getQueriedAnouncementsByUserService,
  updateAnnouncementService,
  getQueriedAnnouncementsService,
  getAnnouncementByIdService,
};
