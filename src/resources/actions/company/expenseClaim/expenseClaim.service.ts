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

async function getExpenseClaimByIdService(
  expenseClaimId: Types.ObjectId
): Promise<ExpenseClaimDocument | null> {
  try {
    const expenseClaim = await ExpenseClaimModel.findById(expenseClaimId).lean().exec();
    return expenseClaim;
  } catch (error: any) {
    throw new Error(error, { cause: 'getExpenseClaimByIdService' });
  }
}

async function deleteAllExpenseClaimsService(): Promise<DeleteResult> {
  try {
    const deleteResult = await ExpenseClaimModel.deleteMany({}).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllExpenseClaimsService' });
  }
}

async function deleteAnExpenseClaimService(expenseClaimId: Types.ObjectId): Promise<DeleteResult> {
  try {
    const deleteResult = await ExpenseClaimModel.deleteOne({ _id: expenseClaimId }).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteExpenseClaimByIdService' });
  }
}

export {
  createNewExpenseClaimService,
  getAllExpenseClaimsService,
  getExpenseClaimsByUserService,
  getExpenseClaimByIdService,
  deleteAllExpenseClaimsService,
  deleteAnExpenseClaimService,
};
