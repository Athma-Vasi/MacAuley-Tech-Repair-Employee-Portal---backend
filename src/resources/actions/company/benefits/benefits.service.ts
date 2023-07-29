import { Types } from 'mongoose';

import type { DeleteResult } from 'mongodb';
import type { BenefitsDocument, BenefitsSchema } from './benefits.model';

import { BenefitsModel } from './benefits.model';
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
} from '../../../../types';

async function createNewBenefitService(newBenefitObj: BenefitsSchema): Promise<BenefitsDocument> {
  try {
    const newBenefits = await BenefitsModel.create(newBenefitObj);
    return newBenefits;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewBenefitsService' });
  }
}

async function getQueriedBenefitsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<BenefitsDocument>): DatabaseResponse<BenefitsDocument> {
  try {
    const allBenefits = await BenefitsModel.find(filter, projection, options).lean().exec();
    return allBenefits;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedBenefitsService' });
  }
}

async function getQueriedTotalBenefitsService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<BenefitsDocument>): Promise<number> {
  try {
    const totalBenefits = await BenefitsModel.countDocuments(filter).lean().exec();
    return totalBenefits;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalBenefitsService' });
  }
}

async function getQueriedBenefitsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<BenefitsDocument>): DatabaseResponse<BenefitsDocument> {
  try {
    const allBenefits = await BenefitsModel.find(filter, projection, options).lean().exec();
    return allBenefits;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedBenefitsByUserService' });
  }
}

async function updateBenefitStatusByIdService({
  benefitId,
  requestStatus,
}: {
  benefitId: Types.ObjectId | string;
  requestStatus: string;
}) {
  try {
    const benefit = await BenefitsModel.findByIdAndUpdate(
      benefitId,
      { requestStatus },
      { new: true }
    )
      .lean()
      .exec();
    return benefit;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateBenefitStatusByIdService' });
  }
}

async function getBenefitByIdService(
  benefitId: Types.ObjectId | string
): DatabaseResponseNullable<BenefitsDocument> {
  try {
    const benefit = await BenefitsModel.findById(benefitId).select('-__v').lean().exec();
    return benefit;
  } catch (error: any) {
    throw new Error(error, { cause: 'getBenefitByIdService' });
  }
}

async function deleteABenefitService(benefitId: Types.ObjectId | string): Promise<DeleteResult> {
  try {
    const deleteResult = await BenefitsModel.deleteOne({ _id: benefitId }).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteABenefitService' });
  }
}

async function deleteAllBenefitsByUserService(
  userId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deleteResult = await BenefitsModel.deleteMany({ userId }).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllBenefitsByUserService' });
  }
}

export {
  createNewBenefitService,
  deleteABenefitService,
  deleteAllBenefitsByUserService,
  getQueriedBenefitsService,
  getQueriedBenefitsByUserService,
  getBenefitByIdService,
  getQueriedTotalBenefitsService,
  updateBenefitStatusByIdService,
};
