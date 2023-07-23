import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';

import { RefermentDocument, RefermentModel, RefermentSchema } from './referment.model';
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
} from '../../../../types';
import { JobPosition, PhoneNumber } from '../../../user';

type CheckRefermentExistsServiceInput = {
  refermentId?: Types.ObjectId | string;
  title?: string;
  userId?: Types.ObjectId | string;
};

async function checkRefermentExistsService({
  refermentId,
  title,
  userId,
}: CheckRefermentExistsServiceInput): Promise<boolean> {
  try {
    if (refermentId) {
      const referment = await RefermentModel.findById(refermentId).lean().exec();
      return referment ? true : false;
    }

    if (title) {
      const referment = await RefermentModel.find({ title }).lean().exec();
      return referment.length > 0 ? true : false;
    }

    if (userId) {
      const referment = await RefermentModel.findById(userId).lean().exec();
      return referment ? true : false;
    }
    return false;
  } catch (error: any) {
    throw new Error(error, { cause: 'checkRefermentExistsService' });
  }
}

async function createNewRefermentService(input: RefermentSchema) {
  try {
    const newReferment = await RefermentModel.create(input);
    return newReferment;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewRefermentService' });
  }
}

async function getQueriedRefermentsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RefermentDocument>): DatabaseResponse<RefermentDocument> {
  try {
    const referments = await RefermentModel.find(filter, projection, options).lean().exec();
    return referments;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedRefermentsService' });
  }
}

async function getQueriedTotalRefermentsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<RefermentDocument>): Promise<number> {
  try {
    const totalReferments = await RefermentModel.countDocuments(filter).lean().exec();
    return totalReferments;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalRefermentsService' });
  }
}

async function getQueriedRefermentsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RefermentDocument>): DatabaseResponse<RefermentDocument> {
  try {
    const referments = await RefermentModel.find(filter, projection, options).lean().exec();
    return referments;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedRefermentsByUserService' });
  }
}

async function getRefermentByIdService(
  refermentId: string
): DatabaseResponseNullable<RefermentDocument> {
  try {
    const referment = await RefermentModel.findById(refermentId).lean().exec();
    return referment;
  } catch (error: any) {
    throw new Error(error, { cause: 'getRefermentByIdService' });
  }
}

async function deleteARefermentService(refermentId: string): Promise<DeleteResult> {
  try {
    const deleteResult = await RefermentModel.deleteOne({
      _id: refermentId,
    })
      .lean()
      .exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteARefermentService' });
  }
}

async function deleteAllRefermentsService(): Promise<DeleteResult> {
  try {
    const deleteResult = await RefermentModel.deleteMany({}).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllRefermentsService' });
  }
}

type UpdateRefermentServiceInput = {
  refermentId: string;
  referrerUserId: Types.ObjectId;
  referrerUsername: string;

  candidateFullName: string;
  candidateEmail: string;
  candidateContactNumber: PhoneNumber;
  candidateCurrentJobTitle: string;
  candidateCurrentCompany: string;
  candidateProfileUrl: string;

  positionReferredFor: JobPosition;
  positionJobDescription: string;
  referralReason: string;
  additionalInformation: string;
  privacyConsent: boolean;
};

async function updateARefermentService(
  input: UpdateRefermentServiceInput
): DatabaseResponseNullable<RefermentDocument> {
  try {
    const updatedReferment = await RefermentModel.findByIdAndUpdate(input.refermentId, input, {
      new: true,
    })
      .lean()
      .exec();
    return updatedReferment;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateRefermentService' });
  }
}

export {
  checkRefermentExistsService,
  createNewRefermentService,
  deleteARefermentService,
  deleteAllRefermentsService,
  getQueriedRefermentsService,
  getRefermentByIdService,
  getQueriedTotalRefermentsService,
  getQueriedRefermentsByUserService,
  updateARefermentService,
};
