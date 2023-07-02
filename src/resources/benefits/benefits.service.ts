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

export { createNewBenefitsService };
