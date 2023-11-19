import { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
} from '../../../../../types';
import { StorageDocument, StorageModel, StorageSchema } from './storage.model';

async function createNewStorageService(storageSchema: StorageSchema): Promise<StorageDocument> {
  try {
    const newStorage = await StorageModel.create(storageSchema);
    return newStorage;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewStorageService' });
  }
}

async function getQueriedStoragesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<StorageDocument>): DatabaseResponse<StorageDocument> {
  try {
    const storages = await StorageModel.find(filter, projection, options).lean().exec();
    return storages;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedStorageService' });
  }
}

async function getQueriedTotalStoragesService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<StorageDocument>): Promise<number> {
  try {
    const totalStorage = await StorageModel.countDocuments(filter).lean().exec();
    return totalStorage;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalStorageService' });
  }
}

async function getStorageByIdService(
  storageId: Types.ObjectId | string
): DatabaseResponseNullable<StorageDocument> {
  try {
    const storage = await StorageModel.findById(storageId).select('-__v').lean().exec();
    return storage;
  } catch (error: any) {
    throw new Error(error, { cause: 'getStorageByIdService' });
  }
}

async function updateStorageByIdService({
  fieldsToUpdate,
  storageId,
}: {
  storageId: Types.ObjectId | string;
  fieldsToUpdate: Record<keyof StorageDocument, StorageDocument[keyof StorageDocument]>;
}): DatabaseResponseNullable<StorageDocument> {
  try {
    const storage = await StorageModel.findByIdAndUpdate(
      storageId,
      { $set: fieldsToUpdate },
      { new: true }
    )
      .select(['-__v', '-action', '-category'])
      .lean()
      .exec();
    return storage;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateStorageByIdService' });
  }
}

async function deleteAllStoragesService(): Promise<DeleteResult> {
  try {
    const storages = await StorageModel.deleteMany({}).lean().exec();
    return storages;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllStoragesService' });
  }
}

async function returnAllUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const storages = await StorageModel.find({}).select('uploadedFilesIds').lean().exec();
    const uploadedFileIds = storages.flatMap((storage) => storage.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllUploadedFileIdsService' });
  }
}

async function deleteAStorageService(storageId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const storage = await StorageModel.deleteOne({ _id: storageId }).lean().exec();
    return storage;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAStorageService' });
  }
}

export {
  createNewStorageService,
  getQueriedStoragesService,
  getQueriedTotalStoragesService,
  getStorageByIdService,
  updateStorageByIdService,
  deleteAllStoragesService,
  returnAllUploadedFileIdsService,
  deleteAStorageService,
};
