import { Types } from 'mongoose';

import type { DeleteResult } from 'mongodb';
import type { BenefitsDocument, BenefitsPlanKind, BenefitsSchema } from './benefits.model';

import { BenefitsModel } from './benefits.model';

type CreateNewBenefitsServiceInput = {
  userId: Types.ObjectId;
  username: string;
  planName: string;
  planDescription: string;
  planKind: BenefitsPlanKind;
  planStartDate: Date;
  isPlanActive: boolean;
  monthlyPremium: number;
  employerContribution: number;
  employeeContribution: number;
};

async function createNewBenefitsService(
  input: CreateNewBenefitsServiceInput
): Promise<BenefitsDocument> {
  try {
    const newBenefits = await BenefitsModel.create(input);
    return newBenefits;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewBenefitsService' });
  }
}

async function deleteABenefitService(benefitId: Types.ObjectId): Promise<DeleteResult> {
  try {
    const deleteResult = await BenefitsModel.deleteOne({ _id: benefitId }).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteABenefitService' });
  }
}

async function deleteAllBenefitsByUserService(userId: Types.ObjectId): Promise<DeleteResult> {
  try {
    const deleteResult = await BenefitsModel.deleteMany({ userId }).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllBenefitsByUserService' });
  }
}

export { createNewBenefitsService, deleteABenefitService, deleteAllBenefitsByUserService };
