import { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
} from '../../../../../types';
import { MouseDocument, MouseModel, MouseSchema } from './mouse.model';

async function createNewMouseService(mouseSchema: MouseSchema): Promise<MouseDocument> {
  try {
    const newMouse = await MouseModel.create(mouseSchema);
    return newMouse;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewMouseService' });
  }
}

async function getQueriedMousesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<MouseDocument>): DatabaseResponse<MouseDocument> {
  try {
    const mouses = await MouseModel.find(filter, projection, options).lean().exec();
    return mouses;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedMouseService' });
  }
}

async function getQueriedTotalMousesService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<MouseDocument>): Promise<number> {
  try {
    const totalMouse = await MouseModel.countDocuments(filter).lean().exec();
    return totalMouse;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalMouseService' });
  }
}

async function getMouseByIdService(
  mouseId: Types.ObjectId | string
): DatabaseResponseNullable<MouseDocument> {
  try {
    const mouse = await MouseModel.findById(mouseId).select('-__v').lean().exec();
    return mouse;
  } catch (error: any) {
    throw new Error(error, { cause: 'getMouseByIdService' });
  }
}

async function updateMouseByIdService({
  fieldsToUpdate,
  mouseId,
}: {
  mouseId: Types.ObjectId | string;
  fieldsToUpdate: Record<keyof MouseDocument, MouseDocument[keyof MouseDocument]>;
}): DatabaseResponseNullable<MouseDocument> {
  try {
    const mouse = await MouseModel.findByIdAndUpdate(
      mouseId,
      { $set: fieldsToUpdate },
      { new: true }
    )
      .select(['-__v', '-action', '-category'])
      .lean()
      .exec();
    return mouse;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateMouseByIdService' });
  }
}

async function deleteAllMousesService(): Promise<DeleteResult> {
  try {
    const mouses = await MouseModel.deleteMany({}).lean().exec();
    return mouses;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllMousesService' });
  }
}

async function returnAllUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const mouses = await MouseModel.find({}).select('uploadedFilesIds').lean().exec();
    const uploadedFileIds = mouses.flatMap((mouse) => mouse.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllUploadedFileIdsService' });
  }
}

async function deleteAMouseService(mouseId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const mouse = await MouseModel.deleteOne({ _id: mouseId }).lean().exec();
    return mouse;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAMouseService' });
  }
}

export {
  createNewMouseService,
  getQueriedMousesService,
  getQueriedTotalMousesService,
  getMouseByIdService,
  updateMouseByIdService,
  deleteAllMousesService,
  returnAllUploadedFileIdsService,
  deleteAMouseService,
};
