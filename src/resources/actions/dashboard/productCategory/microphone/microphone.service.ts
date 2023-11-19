import { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
} from '../../../../../types';
import { MicrophoneDocument, MicrophoneModel, MicrophoneSchema } from './microphone.model';

async function createNewMicrophoneService(
  microphoneSchema: MicrophoneSchema
): Promise<MicrophoneDocument> {
  try {
    const newMicrophone = await MicrophoneModel.create(microphoneSchema);
    return newMicrophone;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewMicrophoneService' });
  }
}

async function getQueriedMicrophonesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<MicrophoneDocument>): DatabaseResponse<MicrophoneDocument> {
  try {
    const microphones = await MicrophoneModel.find(filter, projection, options).lean().exec();
    return microphones;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedMicrophoneService' });
  }
}

async function getQueriedTotalMicrophonesService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<MicrophoneDocument>): Promise<number> {
  try {
    const totalMicrophone = await MicrophoneModel.countDocuments(filter).lean().exec();
    return totalMicrophone;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalMicrophoneService' });
  }
}

async function getMicrophoneByIdService(
  microphoneId: Types.ObjectId | string
): DatabaseResponseNullable<MicrophoneDocument> {
  try {
    const microphone = await MicrophoneModel.findById(microphoneId).select('-__v').lean().exec();
    return microphone;
  } catch (error: any) {
    throw new Error(error, { cause: 'getMicrophoneByIdService' });
  }
}

async function updateMicrophoneByIdService({
  fieldsToUpdate,
  microphoneId,
}: {
  microphoneId: Types.ObjectId | string;
  fieldsToUpdate: Record<keyof MicrophoneDocument, MicrophoneDocument[keyof MicrophoneDocument]>;
}): DatabaseResponseNullable<MicrophoneDocument> {
  try {
    const microphone = await MicrophoneModel.findByIdAndUpdate(
      microphoneId,
      { $set: fieldsToUpdate },
      { new: true }
    )
      .select('-__v')
      .lean()
      .exec();
    return microphone;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateMicrophoneByIdService' });
  }
}

async function deleteAllMicrophonesService(): Promise<DeleteResult> {
  try {
    const microphones = await MicrophoneModel.deleteMany({}).lean().exec();
    return microphones;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllMicrophonesService' });
  }
}

async function returnAllMicrophonesUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const microphones = await MicrophoneModel.find({}).select('uploadedFilesIds').lean().exec();
    const uploadedFileIds = microphones.flatMap((microphone) => microphone.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllMicrophonesUploadedFileIdsService' });
  }
}

async function deleteAMicrophoneService(
  microphoneId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const microphone = await MicrophoneModel.deleteOne({ _id: microphoneId }).lean().exec();
    return microphone;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAMicrophoneService' });
  }
}

export {
  createNewMicrophoneService,
  getQueriedMicrophonesService,
  getQueriedTotalMicrophonesService,
  getMicrophoneByIdService,
  updateMicrophoneByIdService,
  deleteAllMicrophonesService,
  returnAllMicrophonesUploadedFileIdsService,
  deleteAMicrophoneService,
};
