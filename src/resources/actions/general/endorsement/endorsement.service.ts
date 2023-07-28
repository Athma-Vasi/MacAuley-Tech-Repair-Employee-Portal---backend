import type { Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { EndorsementDocument, EndorsementSchema } from './endorsement.model';

import { EndorsementModel } from './endorsement.model';
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  RequestStatus,
} from '../../../../types';

async function createNewEndorsementService(input: EndorsementSchema): Promise<EndorsementDocument> {
  try {
    const newEndorsement = await EndorsementModel.create(input);
    return newEndorsement;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewEndorsementService' });
  }
}

async function getQueriedEndorsementsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<EndorsementDocument>): DatabaseResponse<EndorsementDocument> {
  try {
    const allEndorsements = await EndorsementModel.find(filter, projection, options).lean().exec();
    return allEndorsements;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedEndorsementsService' });
  }
}

async function getQueriedTotalEndorsementsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<EndorsementDocument>): Promise<number> {
  try {
    const totalEndorsements = await EndorsementModel.countDocuments(filter).lean().exec();
    return totalEndorsements;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalEndorsementsService' });
  }
}

async function getQueriedEndorsementsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<EndorsementDocument>): DatabaseResponse<EndorsementDocument> {
  try {
    const endorsements = await EndorsementModel.find(filter, projection, options).lean().exec();
    return endorsements;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedEndorsementsByUserService' });
  }
}

async function getAnEndorsementService(
  id: Types.ObjectId | string
): DatabaseResponseNullable<EndorsementDocument> {
  try {
    const endorsement = await EndorsementModel.findById({ _id: id }).select('-__v').lean().exec();
    return endorsement;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAnEndorsementService' });
  }
}

async function deleteEndorsementService(id: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const deletedEndorsement = await EndorsementModel.deleteOne({
      _id: id,
    })
      .lean()
      .exec();
    return deletedEndorsement;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteEndorsementService' });
  }
}

async function deleteAllEndorsementsService(): Promise<DeleteResult> {
  try {
    const deletedEndorsements = await EndorsementModel.deleteMany({}).lean().exec();
    return deletedEndorsements;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllEndorsementsService' });
  }
}

async function updateEndorsementStatusByIdService({
  endorsementId,
  requestStatus,
}: {
  endorsementId: Types.ObjectId | string;
  requestStatus: RequestStatus;
}): DatabaseResponseNullable<EndorsementDocument> {
  try {
    const updatedEndorsement = await EndorsementModel.findByIdAndUpdate(
      endorsementId,
      { requestStatus },
      { new: true }
    )
      .select('-__v')
      .lean()
      .exec();
    return updatedEndorsement;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateEndorsementStatusByIdService' });
  }
}

export {
  createNewEndorsementService,
  deleteEndorsementService,
  deleteAllEndorsementsService,
  getQueriedEndorsementsService,
  getQueriedEndorsementsByUserService,
  getAnEndorsementService,
  getQueriedTotalEndorsementsService,
  updateEndorsementStatusByIdService,
};
