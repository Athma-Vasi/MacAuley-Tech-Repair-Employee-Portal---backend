import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
  UpdateDocumentByIdServiceInput,
} from "../../../types";
import {
  SmartphoneDocument,
  SmartphoneModel,
  SmartphoneSchema,
} from "./smartphone.model";
import createHttpError from "http-errors";

async function createNewSmartphoneService(
  smartphoneSchema: SmartphoneSchema
): Promise<SmartphoneDocument> {
  try {
    const newSmartphone = await SmartphoneModel.create(smartphoneSchema);
    return newSmartphone;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewSmartphoneService");
  }
}

async function getQueriedSmartphonesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<SmartphoneDocument>): DatabaseResponse<SmartphoneDocument> {
  try {
    const smartphones = await SmartphoneModel.find(filter, projection, options)
      .lean()
      .exec();
    return smartphones;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedSmartphonesService");
  }
}

async function getQueriedTotalSmartphonesService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<SmartphoneDocument>): Promise<number> {
  try {
    const totalSmartphones = await SmartphoneModel.countDocuments(filter).lean().exec();
    return totalSmartphones;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalSmartphonesService");
  }
}

async function getSmartphoneByIdService(
  smartphoneId: Types.ObjectId | string
): DatabaseResponseNullable<SmartphoneDocument> {
  try {
    const smartphone = await SmartphoneModel.findById(smartphoneId)

      .lean()
      .exec();
    return smartphone;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getSmartphoneByIdService");
  }
}

async function updateSmartphoneByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<SmartphoneDocument>): DatabaseResponseNullable<SmartphoneDocument> {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const smartphone = await SmartphoneModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })

      .lean()
      .exec();
    return smartphone;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateSmartphoneByIdService");
  }
}

async function deleteAllSmartphonesService(): Promise<DeleteResult> {
  try {
    const smartphones = await SmartphoneModel.deleteMany({}).lean().exec();
    return smartphones;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllSmartphonesService");
  }
}

async function returnAllSmartphonesUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const smartphones = await SmartphoneModel.find({})
      .select("uploadedFilesIds")
      .lean()
      .exec();
    const uploadedFileIds = smartphones.flatMap(
      (smartphone) => smartphone.uploadedFilesIds
    );
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, {
      cause: "returnAllSmartphonesUploadedFileIdsService",
    });
  }
}

async function deleteASmartphoneService(
  smartphoneId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const smartphone = await SmartphoneModel.deleteOne({
      _id: smartphoneId,
    })
      .lean()
      .exec();
    return smartphone;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteASmartphoneService");
  }
}

export {
  createNewSmartphoneService,
  getQueriedSmartphonesService,
  getQueriedTotalSmartphonesService,
  getSmartphoneByIdService,
  updateSmartphoneByIdService,
  deleteAllSmartphonesService,
  returnAllSmartphonesUploadedFileIdsService,
  deleteASmartphoneService,
};
