import type { DeleteResult } from 'mongodb';
import type { AnonymousRequestDocument, AnonymousRequestSchema } from './anonymousRequest.model';

import { AnonymousRequestModel } from './anonymousRequest.model';
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
} from '../../../../types';

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

async function getQueriedAnonymousRequestsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<AnonymousRequestDocument>): DatabaseResponse<AnonymousRequestDocument> {
  try {
    const allAnonymousRequests = await AnonymousRequestModel.find(filter, projection, options)
      .lean()
      .exec();
    return allAnonymousRequests;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedAnonymousRequestsService' });
  }
}

async function getQueriedTotalAnonymousRequestsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<AnonymousRequestDocument>): Promise<number> {
  try {
    const totalAnonymousRequests = await AnonymousRequestModel.countDocuments(filter).lean().exec();
    return totalAnonymousRequests;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalAnonymousRequestsService' });
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
    const deletedAnonymousRequest = await AnonymousRequestModel.deleteOne({
      _id: anonymousRequestId,
    })
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
  getQueriedAnonymousRequestsService,
  getAnAnonymousRequestService,
  deleteAnAnonymousRequestService,
  deleteAllAnonymousRequestsService,
  getQueriedTotalAnonymousRequestsService,
};
