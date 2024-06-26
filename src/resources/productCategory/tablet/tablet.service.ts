import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
  UpdateDocumentByIdServiceInput,
} from "../../../types";
import { TabletDocument, TabletModel, TabletSchema } from "./tablet.model";
import createHttpError from "http-errors";

async function createNewTabletService(
  tabletSchema: TabletSchema
): Promise<TabletDocument> {
  try {
    const newTablet = await TabletModel.create(tabletSchema);
    return newTablet;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewTabletService");
  }
}

async function getQueriedTabletsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<TabletDocument>): DatabaseResponse<TabletDocument> {
  try {
    const tablets = await TabletModel.find(filter, projection, options).lean().exec();
    return tablets;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTabletsService");
  }
}

async function getQueriedTotalTabletsService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<TabletDocument>): Promise<number> {
  try {
    const totalTablets = await TabletModel.countDocuments(filter).lean().exec();
    return totalTablets;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalTabletsService");
  }
}

async function getTabletByIdService(
  tabletId: Types.ObjectId | string
): DatabaseResponseNullable<TabletDocument> {
  try {
    const tablet = await TabletModel.findById(tabletId)

      .lean()
      .exec();
    return tablet;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getTabletByIdService");
  }
}

async function updateTabletByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<TabletDocument>): DatabaseResponseNullable<TabletDocument> {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const tablet = await TabletModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })

      .lean()
      .exec();
    return tablet;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateTabletByIdService");
  }
}

async function deleteAllTabletsService(): Promise<DeleteResult> {
  try {
    const tablets = await TabletModel.deleteMany({}).lean().exec();
    return tablets;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllTabletsService");
  }
}

async function returnAllTabletsUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const tablets = await TabletModel.find({}).select("uploadedFilesIds").lean().exec();
    const uploadedFileIds = tablets.flatMap((tablet) => tablet.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, {
      cause: "returnAllTabletsUploadedFileIdsService",
    });
  }
}

async function deleteATabletService(
  tabletId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const tablet = await TabletModel.deleteOne({
      _id: tabletId,
    })
      .lean()
      .exec();
    return tablet;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteATabletService");
  }
}

export {
  createNewTabletService,
  getQueriedTabletsService,
  getQueriedTotalTabletsService,
  getTabletByIdService,
  updateTabletByIdService,
  deleteAllTabletsService,
  returnAllTabletsUploadedFileIdsService,
  deleteATabletService,
};
