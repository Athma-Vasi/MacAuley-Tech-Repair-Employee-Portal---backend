import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';

import { RefermentDocument, RefermentModel } from './referment.model';
import { DatabaseResponse, DatabaseResponseNullable } from '../../../../types';

type CheckRefermentExistsServiceInput = {
  refermentId?: Types.ObjectId;
  title?: string;
  userId?: Types.ObjectId;
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

type CreateNewRefermentServiceInput = {
  referrerUserId: Types.ObjectId;
  referrerUsername: string;

  candidateFullName: string;
  candidateEmail: string;
  candidateContactNumber: string;
  candidateCurrentJobTitle: string;
  candidateCurrentCompany: string;
  candidateLinkedinProfile: string;

  positionReferredFor: string;
  positionJobDescription: string;
  referralReason: string;
  additionalInformation: string;
  privacyConsent: boolean;
};

async function createNewRefermentService(input: CreateNewRefermentServiceInput) {
  try {
    const newReferment = await RefermentModel.create(input);
    return newReferment;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewRefermentService' });
  }
}

async function deleteARefermentService(
  refermentId: Types.ObjectId
): DatabaseResponseNullable<RefermentDocument> {
  try {
    const deleteResult = await RefermentModel.findByIdAndDelete(refermentId).lean().exec();
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

async function getAllRefermentsService(): DatabaseResponse<RefermentDocument> {
  try {
    const referments = await RefermentModel.find({}).lean().exec();
    return referments;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllRefermentsService' });
  }
}

async function getARefermentService(
  refermentId: Types.ObjectId
): DatabaseResponseNullable<RefermentDocument> {
  try {
    const referment = await RefermentModel.findById(refermentId).lean().exec();
    return referment;
  } catch (error: any) {
    throw new Error(error, { cause: 'getARefermentService' });
  }
}

async function getRefermentsByUserService(
  userId: Types.ObjectId
): DatabaseResponse<RefermentDocument> {
  try {
    const referments = await RefermentModel.find({ referrerUserId: userId }).lean().exec();
    return referments;
  } catch (error: any) {
    throw new Error(error, { cause: 'getRefermentsByUserService' });
  }
}

type UpdateRefermentServiceInput = {
  refermentId: Types.ObjectId;
  referrerUserId: Types.ObjectId;
  referrerUsername: string;

  candidateFullName: string;
  candidateEmail: string;
  candidateContactNumber: string;
  candidateCurrentJobTitle: string;
  candidateCurrentCompany: string;
  candidateLinkedinProfile: string;

  positionReferredFor: string;
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
  getAllRefermentsService,
  getARefermentService,
  getRefermentsByUserService,
  updateARefermentService,
};
