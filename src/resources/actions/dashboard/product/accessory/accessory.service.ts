import { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
} from '../../../../../types';
import { AccessoryDocument, AccessoryModel, AccessorySchema } from './accessory.model';

async function createNewAccessoryService(
  accessorySchema: AccessorySchema
): Promise<AccessoryDocument> {
  try {
    const newAccessory = await AccessoryModel.create(accessorySchema);
    return newAccessory;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewAccessoryService' });
  }
}

async function getQueriedAccessoriesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<AccessoryDocument>): DatabaseResponse<AccessoryDocument> {
  try {
    const accessorys = await AccessoryModel.find(filter, projection, options).lean().exec();
    return accessorys;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedAccessoriesService' });
  }
}

async function getQueriedTotalAccessoriesService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<AccessoryDocument>): Promise<number> {
  try {
    const totalAccessories = await AccessoryModel.countDocuments(filter).lean().exec();
    return totalAccessories;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalAccessoriesService' });
  }
}

async function getAccessoryByIdService(
  accessoryId: Types.ObjectId | string
): DatabaseResponseNullable<AccessoryDocument> {
  try {
    const accessory = await AccessoryModel.findById(accessoryId).select('-__v').lean().exec();
    return accessory;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAccessoryByIdService' });
  }
}

async function updateAccessoryByIdService({
  fieldsToUpdate,
  accessoryId,
}: {
  accessoryId: Types.ObjectId | string;
  fieldsToUpdate: Record<keyof AccessoryDocument, AccessoryDocument[keyof AccessoryDocument]>;
}): DatabaseResponseNullable<AccessoryDocument> {
  try {
    const accessory = await AccessoryModel.findByIdAndUpdate(
      accessoryId,
      { $set: fieldsToUpdate },
      { new: true }
    )
      .select(['-__v', '-action', '-category'])
      .lean()
      .exec();
    return accessory;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateAccessoryByIdService' });
  }
}

async function deleteAllAccessoriesService(): Promise<DeleteResult> {
  try {
    const accessorys = await AccessoryModel.deleteMany({}).lean().exec();
    return accessorys;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllAccessoriesService' });
  }
}

async function returnAllUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const accessorys = await AccessoryModel.find({}).select('uploadedFilesIds').lean().exec();
    const uploadedFileIds = accessorys.flatMap((accessory) => accessory.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllUploadedFileIdsService' });
  }
}

async function deleteAnAccessoryService(
  accessoryId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const accessory = await AccessoryModel.deleteOne({ _id: accessoryId }).lean().exec();
    return accessory;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAAccessoryService' });
  }
}

export {
  createNewAccessoryService,
  getQueriedAccessoriesService,
  getQueriedTotalAccessoriesService,
  getAccessoryByIdService,
  updateAccessoryByIdService,
  deleteAllAccessoriesService,
  returnAllUploadedFileIdsService,
  deleteAnAccessoryService,
};
