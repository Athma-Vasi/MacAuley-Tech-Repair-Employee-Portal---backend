import { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import {
  QueriedResourceGetRequestServiceInput,
  DatabaseResponse,
  DatabaseResponseNullable,
} from '../../../../../types';
import { WebcamDocument, WebcamModel, WebcamSchema } from './webcam.model';

async function createNewWebcamService(webcamSchema: WebcamSchema): Promise<WebcamDocument> {
  try {
    const newWebcam = await WebcamModel.create(webcamSchema);
    return newWebcam;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewWebcamService' });
  }
}

async function getQueriedWebcamsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<WebcamDocument>): DatabaseResponse<WebcamDocument> {
  try {
    const webcams = await WebcamModel.find(filter, projection, options).lean().exec();
    return webcams;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedWebcamService' });
  }
}

async function getQueriedTotalWebcamsService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<WebcamDocument>): Promise<number> {
  try {
    const totalWebcam = await WebcamModel.countDocuments(filter).lean().exec();
    return totalWebcam;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalWebcamService' });
  }
}

async function getWebcamByIdService(
  webcamId: Types.ObjectId | string
): DatabaseResponseNullable<WebcamDocument> {
  try {
    const webcam = await WebcamModel.findById(webcamId).select('-__v').lean().exec();
    return webcam;
  } catch (error: any) {
    throw new Error(error, { cause: 'getWebcamByIdService' });
  }
}

async function updateWebcamByIdService({
  fieldsToUpdate,
  webcamId,
}: {
  webcamId: Types.ObjectId | string;
  fieldsToUpdate: Record<keyof WebcamDocument, WebcamDocument[keyof WebcamDocument]>;
}): DatabaseResponseNullable<WebcamDocument> {
  try {
    const webcam = await WebcamModel.findByIdAndUpdate(
      webcamId,
      { $set: fieldsToUpdate },
      { new: true }
    )
      .select(['-__v', '-action', '-category'])
      .lean()
      .exec();
    return webcam;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateWebcamByIdService' });
  }
}

async function deleteAllWebcamsService(): Promise<DeleteResult> {
  try {
    const webcams = await WebcamModel.deleteMany({}).lean().exec();
    return webcams;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllWebcamsService' });
  }
}

async function returnAllUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const webcams = await WebcamModel.find({}).select('uploadedFilesIds').lean().exec();
    const uploadedFileIds = webcams.flatMap((webcam) => webcam.uploadedFilesIds);
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllUploadedFileIdsService' });
  }
}

async function deleteAWebcamService(webcamId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const webcam = await WebcamModel.deleteOne({ _id: webcamId }).lean().exec();
    return webcam;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAWebcamService' });
  }
}

export {
  createNewWebcamService,
  getQueriedWebcamsService,
  getQueriedTotalWebcamsService,
  getWebcamByIdService,
  updateWebcamByIdService,
  deleteAllWebcamsService,
  returnAllUploadedFileIdsService,
  deleteAWebcamService,
};
