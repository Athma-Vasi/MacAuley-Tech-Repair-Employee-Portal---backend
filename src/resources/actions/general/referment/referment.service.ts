import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';

import { RefermentModel } from './referment.model';

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

export { checkRefermentExistsService, createNewRefermentService };
