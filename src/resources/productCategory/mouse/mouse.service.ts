import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
  UpdateDocumentByIdServiceInput,
} from "../../../types";
import { MouseDocument, MouseModel, MouseSchema } from "./mouse.model";
import createHttpError from "http-errors";

async function createNewMouseService(mouseSchema: MouseSchema): Promise<MouseDocument> {
  try {
    const newMouse = await MouseModel.create(mouseSchema);
    return newMouse;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewMouseService");
  }
}

async function getQueriedMiceService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<MouseDocument>): DatabaseResponse<MouseDocument> {
  try {
    const mouses = await MouseModel.find(filter, projection, options).lean().exec();
    return mouses;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedMiceService");
  }
}

async function getQueriedTotalMiceService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<MouseDocument>): Promise<number> {
  try {
    const totalMice = await MouseModel.countDocuments(filter).lean().exec();
    return totalMice;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalMiceService");
  }
}

async function getMouseByIdService(
  mouseId: Types.ObjectId | string
): DatabaseResponseNullable<MouseDocument> {
  try {
    const mouse = await MouseModel.findById(mouseId)

      .lean()
      .exec();
    return mouse;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getMouseByIdService");
  }
}

async function updateMouseByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<MouseDocument>): DatabaseResponseNullable<MouseDocument> {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const mouse = await MouseModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })

      .lean()
      .exec();
    return mouse;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateMouseByIdService");
  }
}

async function deleteAllMiceService(): Promise<DeleteResult> {
  try {
    const mouses = await MouseModel.deleteMany({}).lean().exec();
    return mouses;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllMiceService");
  }
}

async function returnAllMiceUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const mouses = await MouseModel.find({}).select("uploadedFilesIds").lean().exec();
    const uploadedFileIds = mouses.flatMap((mouse) => mouse.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, {
      cause: "returnAllMiceUploadedFileIdsService",
    });
  }
}

async function deleteAMouseService(
  mouseId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const mouse = await MouseModel.deleteOne({
      _id: mouseId,
    })
      .lean()
      .exec();
    return mouse;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAMouseService");
  }
}

export {
  createNewMouseService,
  getQueriedMiceService,
  getQueriedTotalMiceService,
  getMouseByIdService,
  updateMouseByIdService,
  deleteAllMiceService,
  returnAllMiceUploadedFileIdsService,
  deleteAMouseService,
};
