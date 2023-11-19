import { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
} from '../../../../../types';
import { HeadphoneDocument, HeadphoneModel, HeadphoneSchema } from './headphone.model';

async function createNewHeadphoneService(
  headphoneSchema: HeadphoneSchema
): Promise<HeadphoneDocument> {
  try {
    const newHeadphone = await HeadphoneModel.create(headphoneSchema);
    return newHeadphone;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewHeadphoneService' });
  }
}

async function getQueriedHeadphonesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<HeadphoneDocument>): DatabaseResponse<HeadphoneDocument> {
  try {
    const headphones = await HeadphoneModel.find(filter, projection, options).lean().exec();
    return headphones;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedHeadphoneService' });
  }
}

async function getQueriedTotalHeadphonesService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<HeadphoneDocument>): Promise<number> {
  try {
    const totalHeadphone = await HeadphoneModel.countDocuments(filter).lean().exec();
    return totalHeadphone;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalHeadphoneService' });
  }
}

async function getHeadphoneByIdService(
  headphoneId: Types.ObjectId | string
): DatabaseResponseNullable<HeadphoneDocument> {
  try {
    const headphone = await HeadphoneModel.findById(headphoneId).select('-__v').lean().exec();
    return headphone;
  } catch (error: any) {
    throw new Error(error, { cause: 'getHeadphoneByIdService' });
  }
}

async function updateHeadphoneByIdService({
  fieldsToUpdate,
  headphoneId,
}: {
  headphoneId: Types.ObjectId | string;
  fieldsToUpdate: Record<keyof HeadphoneDocument, HeadphoneDocument[keyof HeadphoneDocument]>;
}): DatabaseResponseNullable<HeadphoneDocument> {
  try {
    const headphone = await HeadphoneModel.findByIdAndUpdate(
      headphoneId,
      { $set: fieldsToUpdate },
      { new: true }
    )
      .select(['-__v', '-action', '-category'])
      .lean()
      .exec();
    return headphone;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateHeadphoneByIdService' });
  }
}

async function deleteAllHeadphonesService(): Promise<DeleteResult> {
  try {
    const headphones = await HeadphoneModel.deleteMany({}).lean().exec();
    return headphones;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllHeadphonesService' });
  }
}

async function returnAllUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const headphones = await HeadphoneModel.find({}).select('uploadedFilesIds').lean().exec();
    const uploadedFileIds = headphones.flatMap((headphone) => headphone.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllUploadedFileIdsService' });
  }
}

async function deleteAHeadphoneService(
  headphoneId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const headphone = await HeadphoneModel.deleteOne({ _id: headphoneId }).lean().exec();
    return headphone;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAHeadphoneService' });
  }
}

export {
  createNewHeadphoneService,
  getQueriedHeadphonesService,
  getQueriedTotalHeadphonesService,
  getHeadphoneByIdService,
  updateHeadphoneByIdService,
  deleteAllHeadphonesService,
  returnAllUploadedFileIdsService,
  deleteAHeadphoneService,
};
