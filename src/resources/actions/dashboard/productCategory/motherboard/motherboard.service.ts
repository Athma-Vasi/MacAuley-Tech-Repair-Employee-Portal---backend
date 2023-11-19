import { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
} from '../../../../../types';
import { MotherboardDocument, MotherboardModel, MotherboardSchema } from './motherboard.model';

async function createNewMotherboardService(
  motherboardSchema: MotherboardSchema
): Promise<MotherboardDocument> {
  try {
    const newMotherboard = await MotherboardModel.create(motherboardSchema);
    return newMotherboard;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewMotherboardService' });
  }
}

async function getQueriedMotherboardsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<MotherboardDocument>): DatabaseResponse<MotherboardDocument> {
  try {
    const motherboards = await MotherboardModel.find(filter, projection, options).lean().exec();
    return motherboards;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedMotherboardService' });
  }
}

async function getQueriedTotalMotherboardsService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<MotherboardDocument>): Promise<number> {
  try {
    const totalMotherboard = await MotherboardModel.countDocuments(filter).lean().exec();
    return totalMotherboard;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalMotherboardService' });
  }
}

async function getMotherboardByIdService(
  motherboardId: Types.ObjectId | string
): DatabaseResponseNullable<MotherboardDocument> {
  try {
    const motherboard = await MotherboardModel.findById(motherboardId).select('-__v').lean().exec();
    return motherboard;
  } catch (error: any) {
    throw new Error(error, { cause: 'getMotherboardByIdService' });
  }
}

async function updateMotherboardByIdService({
  fieldsToUpdate,
  motherboardId,
}: {
  motherboardId: Types.ObjectId | string;
  fieldsToUpdate: Record<keyof MotherboardDocument, MotherboardDocument[keyof MotherboardDocument]>;
}): DatabaseResponseNullable<MotherboardDocument> {
  try {
    const motherboard = await MotherboardModel.findByIdAndUpdate(
      motherboardId,
      { $set: fieldsToUpdate },
      { new: true }
    )
      .select('-__v')
      .lean()
      .exec();
    return motherboard;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateMotherboardByIdService' });
  }
}

async function deleteAllMotherboardsService(): Promise<DeleteResult> {
  try {
    const motherboards = await MotherboardModel.deleteMany({}).lean().exec();
    return motherboards;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllMotherboardsService' });
  }
}

async function returnAllMotherboardsUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const motherboards = await MotherboardModel.find({}).select('uploadedFilesIds').lean().exec();
    const uploadedFileIds = motherboards.flatMap((motherboard) => motherboard.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllMotherboardsUploadedFileIdsService' });
  }
}

async function deleteAMotherboardService(
  motherboardId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const motherboard = await MotherboardModel.deleteOne({ _id: motherboardId }).lean().exec();
    return motherboard;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAMotherboardService' });
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
