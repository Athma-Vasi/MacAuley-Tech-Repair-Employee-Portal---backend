import type { DeleteResult } from 'mongodb';
import type { AnonymousRequestDocument, AnonymousRequestSchema } from './anonymousRequest.model';

import { AnonymousRequestModel } from './anonymousRequest.model';
import { DatabaseResponse, DatabaseResponseNullable } from '../../../../types';

async function createNewAnonymousRequestService(
  input: AnonymousRequestSchema
): Promise<AnonymousRequestDocument> {
  try {
    const newAnonymousRequest = await AnonymousRequestModel.create(input);
    return newAnonymousRequest;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewAnonymousRequestService' });
  }
}

async function getAllAnonymousRequestsService(): DatabaseResponse<AnonymousRequestDocument> {
  try {
    const allAnonymousRequests = await AnonymousRequestModel.find({}).lean().exec();
    return allAnonymousRequests;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllAnonymousRequestsService' });
  }
}

async function getAnAnonymousRequestService(
  anonymousRequestId: string
): DatabaseResponseNullable<AnonymousRequestDocument> {
  try {
    const anonymousRequest = await AnonymousRequestModel.findById(anonymousRequestId).lean().exec();
    return anonymousRequest;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAnAnonymousRequestService' });
  }
}

async function deleteAnAnonymousRequestService(anonymousRequestId: string): Promise<DeleteResult> {
  try {
    const deletedAnonymousRequest = await AnonymousRequestModel.deleteOne({ anonymousRequestId })
      .lean()
      .exec();
    return deletedAnonymousRequest;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAnAnonymousRequestService' });
  }
}

async function deleteAllAnonymousRequestsService(): Promise<DeleteResult> {
  try {
    const deletedAnonymousRequests = await AnonymousRequestModel.deleteMany({}).lean().exec();
    return deletedAnonymousRequests;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllAnonymousRequestsService' });
  }
}

export {
  createNewAnonymousRequestService,
  getAllAnonymousRequestsService,
  getAnAnonymousRequestService,
  deleteAnAnonymousRequestService,
  deleteAllAnonymousRequestsService,
};
