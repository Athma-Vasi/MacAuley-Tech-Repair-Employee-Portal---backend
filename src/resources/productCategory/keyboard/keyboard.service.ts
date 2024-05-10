import { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
  UpdateDocumentByIdServiceInput,
} from "../../../types";
import { KeyboardDocument, KeyboardModel, KeyboardSchema } from "./keyboard.model";
import createHttpError from "http-errors";

async function createNewKeyboardService(
  keyboardSchema: KeyboardSchema
): Promise<KeyboardDocument> {
  try {
    const newKeyboard = await KeyboardModel.create(keyboardSchema);
    return newKeyboard;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewKeyboardService");
  }
}

async function getQueriedKeyboardsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<KeyboardDocument>): DatabaseResponse<KeyboardDocument> {
  try {
    const keyboards = await KeyboardModel.find(filter, projection, options).lean().exec();
    return keyboards;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedKeyboardsService");
  }
}

async function getQueriedTotalKeyboardsService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<KeyboardDocument>): Promise<number> {
  try {
    const totalKeyboards = await KeyboardModel.countDocuments(filter).lean().exec();
    return totalKeyboards;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalKeyboardsService");
  }
}

async function getKeyboardByIdService(
  keyboardId: Types.ObjectId | string
): DatabaseResponseNullable<KeyboardDocument> {
  try {
    const keyboard = await KeyboardModel.findById(keyboardId)

      .lean()
      .exec();
    return keyboard;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getKeyboardByIdService");
  }
}

async function updateKeyboardByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<KeyboardDocument>): DatabaseResponseNullable<KeyboardDocument> {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const keyboard = await KeyboardModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })

      .lean()
      .exec();
    return keyboard;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateKeyboardByIdService");
  }
}

async function deleteAllKeyboardsService(): Promise<DeleteResult> {
  try {
    const keyboards = await KeyboardModel.deleteMany({}).lean().exec();
    return keyboards;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllKeyboardsService");
  }
}

async function returnAllKeyboardsUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const keyboards = await KeyboardModel.find({})
      .select("uploadedFilesIds")
      .lean()
      .exec();
    const uploadedFileIds = keyboards.flatMap((keyboard) => keyboard.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, {
      cause: "returnAllKeyboardsUploadedFileIdsService",
    });
  }
}

async function deleteAKeyboardService(
  keyboardId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const keyboard = await KeyboardModel.deleteOne({
      _id: keyboardId,
    })
      .lean()
      .exec();
    return keyboard;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAKeyboardService");
  }
}

export {
  createNewKeyboardService,
  getQueriedKeyboardsService,
  getQueriedTotalKeyboardsService,
  getKeyboardByIdService,
  updateKeyboardByIdService,
  deleteAllKeyboardsService,
  returnAllKeyboardsUploadedFileIdsService,
  deleteAKeyboardService,
};
