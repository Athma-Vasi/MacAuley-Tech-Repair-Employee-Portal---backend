import { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
} from '../../../../../types';
import { SmartphoneDocument, SmartphoneModel, SmartphoneSchema } from './smartphone.model';

async function createNewSmartphoneService(
  smartphoneSchema: SmartphoneSchema
): Promise<SmartphoneDocument> {
  try {
    const newSmartphone = await SmartphoneModel.create(smartphoneSchema);
    return newSmartphone;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewSmartphoneService' });
  }
}

async function getQueriedSmartphonesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<SmartphoneDocument>): DatabaseResponse<SmartphoneDocument> {
  try {
    const smartphones = await SmartphoneModel.find(filter, projection, options).lean().exec();
    return smartphones;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedSmartphoneService' });
  }
}

async function getQueriedTotalSmartphonesService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<SmartphoneDocument>): Promise<number> {
  try {
    const totalSmartphone = await SmartphoneModel.countDocuments(filter).lean().exec();
    return totalSmartphone;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalSmartphoneService' });
  }
}

async function getSmartphoneByIdService(
  smartphoneId: Types.ObjectId | string
): DatabaseResponseNullable<SmartphoneDocument> {
  try {
    const smartphone = await SmartphoneModel.findById(smartphoneId).select('-__v').lean().exec();
    return smartphone;
  } catch (error: any) {
    throw new Error(error, { cause: 'getSmartphoneByIdService' });
  }
}

async function updateSmartphoneByIdService({
  fieldsToUpdate,
  smartphoneId,
}: {
  smartphoneId: Types.ObjectId | string;
  fieldsToUpdate: Record<keyof SmartphoneDocument, SmartphoneDocument[keyof SmartphoneDocument]>;
}): DatabaseResponseNullable<SmartphoneDocument> {
  try {
    const smartphone = await SmartphoneModel.findByIdAndUpdate(
      smartphoneId,
      { $set: fieldsToUpdate },
      { new: true }
    )
      .select(['-__v', '-action', '-category'])
      .lean()
      .exec();
    return smartphone;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateSmartphoneByIdService' });
  }
}

async function deleteAllSmartphonesService(): Promise<DeleteResult> {
  try {
    const smartphones = await SmartphoneModel.deleteMany({}).lean().exec();
    return smartphones;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllSmartphonesService' });
  }
}

async function returnAllUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const smartphones = await SmartphoneModel.find({}).select('uploadedFilesIds').lean().exec();
    const uploadedFileIds = smartphones.flatMap((smartphone) => smartphone.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllUploadedFileIdsService' });
  }
}

async function deleteASmartphoneService(
  smartphoneId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const smartphone = await SmartphoneModel.deleteOne({ _id: smartphoneId }).lean().exec();
    return smartphone;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteASmartphoneService' });
  }
}

export {
  createNewSmartphoneService,
  getQueriedSmartphonesService,
  getQueriedTotalSmartphonesService,
  getSmartphoneByIdService,
  updateSmartphoneByIdService,
  deleteAllSmartphonesService,
  returnAllUploadedFileIdsService,
  deleteASmartphoneService,
};
