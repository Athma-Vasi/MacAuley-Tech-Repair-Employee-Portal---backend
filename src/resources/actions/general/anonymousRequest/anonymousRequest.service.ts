import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type {
  AnonymousRequestKind,
  AnonymousRequestUrgency,
  AnonymousRequestDocument,
} from './anonymousRequest.model';
import type { ActionsGeneral } from '../../general';

import { AnonymousRequestModel } from './anonymousRequest.model';

type CreateNewAnonymousRequestServiceInput = {
  title: ActionsGeneral;
  secureContactNumber: string;
  secureContactEmail: string;
  requestKind: AnonymousRequestKind;
  requestDescription: string;
  additionalInformation: string;
  urgency: AnonymousRequestUrgency;
};

async function createNewAnonymousRequestService(input: CreateNewAnonymousRequestServiceInput) {
  try {
    const newAnonymousRequest = await AnonymousRequestModel.create(input);
    return newAnonymousRequest;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewAnonymousRequestService' });
  }
}

async function getAllAnonymousRequestsService(): Promise<
  (FlattenMaps<AnonymousRequestDocument> &
    Required<{
      _id: Types.ObjectId;
    }>)[]
> {
  try {
    const allAnonymousRequests = await AnonymousRequestModel.find({}).lean().exec();
    return allAnonymousRequests;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllAnonymousRequestsService' });
  }
}

async function getAnAnonymousRequestService(anonymousRequestId: Types.ObjectId): Promise<
  | (FlattenMaps<AnonymousRequestDocument> &
      Required<{
        _id: Types.ObjectId;
      }>)
  | null
> {
  try {
    const anonymousRequest = await AnonymousRequestModel.findById(anonymousRequestId).lean().exec();
    return anonymousRequest;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAnAnonymousRequestService' });
  }
}

async function deleteAnAnonymousRequestService(anonymousRequestId: Types.ObjectId) {
  try {
    const deletedAnonymousRequest = await AnonymousRequestModel.findByIdAndDelete(
      anonymousRequestId
    )
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
