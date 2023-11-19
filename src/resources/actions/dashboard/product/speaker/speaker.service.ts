import { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
} from '../../../../../types';
import { SpeakerDocument, SpeakerModel, SpeakerSchema } from './speaker.model';

async function createNewSpeakerService(speakerSchema: SpeakerSchema): Promise<SpeakerDocument> {
  try {
    const newSpeaker = await SpeakerModel.create(speakerSchema);
    return newSpeaker;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewSpeakerService' });
  }
}

async function getQueriedSpeakersService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<SpeakerDocument>): DatabaseResponse<SpeakerDocument> {
  try {
    const speakers = await SpeakerModel.find(filter, projection, options).lean().exec();
    return speakers;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedSpeakerService' });
  }
}

async function getQueriedTotalSpeakersService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<SpeakerDocument>): Promise<number> {
  try {
    const totalSpeaker = await SpeakerModel.countDocuments(filter).lean().exec();
    return totalSpeaker;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalSpeakerService' });
  }
}

async function getSpeakerByIdService(
  speakerId: Types.ObjectId | string
): DatabaseResponseNullable<SpeakerDocument> {
  try {
    const speaker = await SpeakerModel.findById(speakerId).select('-__v').lean().exec();
    return speaker;
  } catch (error: any) {
    throw new Error(error, { cause: 'getSpeakerByIdService' });
  }
}

async function updateSpeakerByIdService({
  fieldsToUpdate,
  speakerId,
}: {
  speakerId: Types.ObjectId | string;
  fieldsToUpdate: Record<keyof SpeakerDocument, SpeakerDocument[keyof SpeakerDocument]>;
}): DatabaseResponseNullable<SpeakerDocument> {
  try {
    const speaker = await SpeakerModel.findByIdAndUpdate(
      speakerId,
      { $set: fieldsToUpdate },
      { new: true }
    )
      .select(['-__v', '-action', '-category'])
      .lean()
      .exec();
    return speaker;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateSpeakerByIdService' });
  }
}

async function deleteAllSpeakersService(): Promise<DeleteResult> {
  try {
    const speakers = await SpeakerModel.deleteMany({}).lean().exec();
    return speakers;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllSpeakersService' });
  }
}

async function returnAllUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const speakers = await SpeakerModel.find({}).select('uploadedFilesIds').lean().exec();
    const uploadedFileIds = speakers.flatMap((speaker) => speaker.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllUploadedFileIdsService' });
  }
}

async function deleteASpeakerService(speakerId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const speaker = await SpeakerModel.deleteOne({ _id: speakerId }).lean().exec();
    return speaker;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteASpeakerService' });
  }
}

export {
  createNewSpeakerService,
  getQueriedSpeakersService,
  getQueriedTotalSpeakersService,
  getSpeakerByIdService,
  updateSpeakerByIdService,
  deleteAllSpeakersService,
  returnAllUploadedFileIdsService,
  deleteASpeakerService,
};
