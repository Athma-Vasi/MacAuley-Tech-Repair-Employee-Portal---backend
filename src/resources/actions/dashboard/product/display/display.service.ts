import { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
} from '../../../../../types';
import { DisplayDocument, DisplayModel, DisplaySchema } from './display.model';

async function createNewDisplayService(displaySchema: DisplaySchema): Promise<DisplayDocument> {
  try {
    const newDisplay = await DisplayModel.create(displaySchema);
    return newDisplay;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewDisplayService' });
  }
}

async function getQueriedDisplaysService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<DisplayDocument>): DatabaseResponse<DisplayDocument> {
  try {
    const displays = await DisplayModel.find(filter, projection, options).lean().exec();
    return displays;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedDisplayService' });
  }
}

async function getQueriedTotalDisplaysService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<DisplayDocument>): Promise<number> {
  try {
    const totalDisplay = await DisplayModel.countDocuments(filter).lean().exec();
    return totalDisplay;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalDisplayService' });
  }
}

async function getDisplayByIdService(
  displayId: Types.ObjectId | string
): DatabaseResponseNullable<DisplayDocument> {
  try {
    const display = await DisplayModel.findById(displayId).select('-__v').lean().exec();
    return display;
  } catch (error: any) {
    throw new Error(error, { cause: 'getDisplayByIdService' });
  }
}

async function updateDisplayByIdService({
  fieldsToUpdate,
  displayId,
}: {
  displayId: Types.ObjectId | string;
  fieldsToUpdate: Record<keyof DisplayDocument, DisplayDocument[keyof DisplayDocument]>;
}): DatabaseResponseNullable<DisplayDocument> {
  try {
    const display = await DisplayModel.findByIdAndUpdate(
      displayId,
      { $set: fieldsToUpdate },
      { new: true }
    )
      .select(['-__v', '-action', '-category'])
      .lean()
      .exec();
    return display;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateDisplayByIdService' });
  }
}

async function deleteAllDisplaysService(): Promise<DeleteResult> {
  try {
    const displays = await DisplayModel.deleteMany({}).lean().exec();
    return displays;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllDisplaysService' });
  }
}

async function returnAllUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const displays = await DisplayModel.find({}).select('uploadedFilesIds').lean().exec();
    const uploadedFileIds = displays.flatMap((display) => display.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllUploadedFileIdsService' });
  }
}

async function deleteADisplayService(displayId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const display = await DisplayModel.deleteOne({ _id: displayId }).lean().exec();
    return display;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteADisplayService' });
  }
}

export {
  createNewDisplayService,
  getQueriedDisplaysService,
  getQueriedTotalDisplaysService,
  getDisplayByIdService,
  updateDisplayByIdService,
  deleteAllDisplaysService,
  returnAllUploadedFileIdsService,
  deleteADisplayService,
};
