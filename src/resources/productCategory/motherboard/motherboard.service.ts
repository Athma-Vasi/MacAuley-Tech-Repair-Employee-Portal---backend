import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
  UpdateDocumentByIdServiceInput,
} from "../../../types";
import {
  MotherboardDocument,
  MotherboardModel,
  MotherboardSchema,
} from "./motherboard.model";
import createHttpError from "http-errors";

async function createNewMotherboardService(
  motherboardSchema: MotherboardSchema
): Promise<MotherboardDocument> {
  try {
    const newMotherboard = await MotherboardModel.create(motherboardSchema);
    return newMotherboard;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewMotherboardService");
  }
}

async function getQueriedMotherboardsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<MotherboardDocument>): DatabaseResponse<MotherboardDocument> {
  try {
    const motherboards = await MotherboardModel.find(filter, projection, options)
      .lean()
      .exec();
    return motherboards;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedMotherboardsService");
  }
}

async function getQueriedTotalMotherboardsService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<MotherboardDocument>): Promise<number> {
  try {
    const totalMotherboards = await MotherboardModel.countDocuments(filter).lean().exec();
    return totalMotherboards;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalMotherboardsService");
  }
}

async function getMotherboardByIdService(
  motherboardId: Types.ObjectId | string
): DatabaseResponseNullable<MotherboardDocument> {
  try {
    const motherboard = await MotherboardModel.findById(motherboardId)

      .lean()
      .exec();
    return motherboard;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getMotherboardByIdService");
  }
}

async function updateMotherboardByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<MotherboardDocument>): DatabaseResponseNullable<MotherboardDocument> {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const motherboard = await MotherboardModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })

      .lean()
      .exec();
    return motherboard;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateMotherboardByIdService");
  }
}

async function deleteAllMotherboardsService(): Promise<DeleteResult> {
  try {
    const motherboards = await MotherboardModel.deleteMany({}).lean().exec();
    return motherboards;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllMotherboardsService");
  }
}

async function returnAllMotherboardsUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const motherboards = await MotherboardModel.find({})
      .select("uploadedFilesIds")
      .lean()
      .exec();
    const uploadedFileIds = motherboards.flatMap(
      (motherboard) => motherboard.uploadedFilesIds
    );
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, {
      cause: "returnAllMotherboardsUploadedFileIdsService",
    });
  }
}

async function deleteAMotherboardService(
  motherboardId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const motherboard = await MotherboardModel.deleteOne({
      _id: motherboardId,
    })
      .lean()
      .exec();
    return motherboard;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAMotherboardService");
  }
}

export {
  createNewMotherboardService,
  getQueriedMotherboardsService,
  getQueriedTotalMotherboardsService,
  getMotherboardByIdService,
  updateMotherboardByIdService,
  deleteAllMotherboardsService,
  returnAllMotherboardsUploadedFileIdsService,
  deleteAMotherboardService,
};
