import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { AnnouncementDocument, AnnouncementSchema } from "./announcement.model";
import type {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../../../types";

import { AnnouncementModel } from "./announcement.model";
import createHttpError from "http-errors";

async function getAnnouncementByIdService(
  announcementId: Types.ObjectId | string
): DatabaseResponseNullable<AnnouncementDocument> {
  try {
    const announcement = await AnnouncementModel.findById(announcementId).lean().exec();
    return announcement;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getAnnouncementByIdService");
  }
}

async function createNewAnnouncementService(
  announcementSchema: AnnouncementSchema
): Promise<AnnouncementDocument> {
  try {
    const announcement = await AnnouncementModel.create(announcementSchema);
    return announcement;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewAnnouncementService");
  }
}

async function getQueriedAnnouncementsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<AnnouncementDocument>): DatabaseResponse<AnnouncementDocument> {
  try {
    const announcement = await AnnouncementModel.find(filter, projection, options)
      .lean()
      .exec();
    return announcement;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedAnnouncementsService");
  }
}

async function getQueriedTotalAnnouncementsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<AnnouncementDocument>): Promise<number> {
  try {
    const totalAnnouncements = await AnnouncementModel.countDocuments(filter)
      .lean()
      .exec();
    return totalAnnouncements;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalAnnouncementsService");
  }
}

async function getQueriedAnnouncementsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<AnnouncementDocument>): DatabaseResponse<AnnouncementDocument> {
  try {
    const announcements = await AnnouncementModel.find(filter, projection, options)
      .lean()
      .exec();
    return announcements;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedAnnouncementsByUserService");
  }
}

async function updateAnnouncementByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<AnnouncementDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const announcement = await AnnouncementModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return announcement;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateAnnouncementStatusByIdService");
  }
}

async function deleteAnnouncementByIdService(
  announcementId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await AnnouncementModel.deleteOne({
      _id: announcementId,
    })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAnnouncementByIdService");
  }
}

async function deleteAllAnnouncementsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await AnnouncementModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllAnnouncementsService");
  }
}

export {
  createNewAnnouncementService,
  deleteAllAnnouncementsService,
  deleteAnnouncementByIdService,
  getAnnouncementByIdService,
  getQueriedAnnouncementsByUserService,
  getQueriedAnnouncementsService,
  getQueriedTotalAnnouncementsService,
  updateAnnouncementByIdService,
};
