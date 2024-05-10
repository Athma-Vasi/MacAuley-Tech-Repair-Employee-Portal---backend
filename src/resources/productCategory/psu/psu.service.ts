import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
  UpdateDocumentByIdServiceInput,
} from "../../../types";
import { PsuDocument, PsuModel, PsuSchema } from "./psu.model";
import createHttpError from "http-errors";

async function createNewPsuService(psuSchema: PsuSchema): Promise<PsuDocument> {
  try {
    const newPsu = await PsuModel.create(psuSchema);
    return newPsu;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewPsuService");
  }
}

async function getQueriedPsusService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<PsuDocument>): DatabaseResponse<PsuDocument> {
  try {
    const psus = await PsuModel.find(filter, projection, options).lean().exec();
    return psus;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedPsusService");
  }
}

async function getQueriedTotalPsusService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<PsuDocument>): Promise<number> {
  try {
    const totalPsus = await PsuModel.countDocuments(filter).lean().exec();
    return totalPsus;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalPsusService");
  }
}

async function getPsuByIdService(
  psuId: Types.ObjectId | string
): DatabaseResponseNullable<PsuDocument> {
  try {
    const psu = await PsuModel.findById(psuId)

      .lean()
      .exec();
    return psu;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getPsuByIdService");
  }
}

async function updatePsuByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<PsuDocument>): DatabaseResponseNullable<PsuDocument> {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const psu = await PsuModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })

      .lean()
      .exec();
    return psu;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updatePsuByIdService");
  }
}

async function deleteAllPsusService(): Promise<DeleteResult> {
  try {
    const psus = await PsuModel.deleteMany({}).lean().exec();
    return psus;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllPsusService");
  }
}

async function returnAllPsusUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const psus = await PsuModel.find({}).select("uploadedFilesIds").lean().exec();
    const uploadedFileIds = psus.flatMap((psu) => psu.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, {
      cause: "returnAllPsusUploadedFileIdsService",
    });
  }
}

async function deleteAPsuService(psuId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const psu = await PsuModel.deleteOne({
      _id: psuId,
    })
      .lean()
      .exec();
    return psu;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAPsuService");
  }
}

export {
  createNewPsuService,
  getQueriedPsusService,
  getQueriedTotalPsusService,
  getPsuByIdService,
  updatePsuByIdService,
  deleteAllPsusService,
  returnAllPsusUploadedFileIdsService,
  deleteAPsuService,
};
