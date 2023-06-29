import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type {
  Currency,
  ExpenseClaimDocument,
  ExpenseClaimSchema,
  ExpenseClaimType,
} from './expenseClaim.model';

import { ExpenseClaimModel } from './expenseClaim.model';

type CreateNewExpenseClaimServiceInput = {
  userId: Types.ObjectId;
  username: string;
  receiptPhotoId: Types.ObjectId;
  expenseClaimType: ExpenseClaimType;
  expenseClaimAmount: number;
  expenseClaimCurrency: Currency;
  expenseClaimDate: Date;
  expenseClaimDescription: string;
  additionalComments: string;
  acknowledgement: boolean;
};

async function createNewExpenseClaimService(
  expenseClaimData: CreateNewExpenseClaimServiceInput
): Promise<ExpenseClaimDocument> {
  try {
    const newExpenseClaim = await ExpenseClaimModel.create(expenseClaimData);
    return newExpenseClaim;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewExpenseClaimService' });
  }
}

async function getAllExpenseClaimsService(): Promise<Array<ExpenseClaimDocument>> {
  try {
    const expenseClaims = await ExpenseClaimModel.find({}).lean().exec();
    return expenseClaims;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllExpenseClaimsService' });
  }
}

async function getExpenseClaimsByUserService(
  userId: Types.ObjectId
): Promise<Array<ExpenseClaimDocument>> {
  try {
    const expenseClaims = await ExpenseClaimModel.find({ userId }).lean().exec();
    return expenseClaims;
  } catch (error: any) {
    throw new Error(error, { cause: 'getExpenseClaimsByUserService' });
  }
}

export { createNewExpenseClaimService, getAllExpenseClaimsService, getExpenseClaimsByUserService };
