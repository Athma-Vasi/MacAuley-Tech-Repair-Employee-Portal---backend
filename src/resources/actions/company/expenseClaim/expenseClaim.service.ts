import { Types } from 'mongoose';

import type { DeleteResult } from 'mongodb';
import type {
  Currency,
  ExpenseClaimDocument,
  ExpenseClaimSchema,
  ExpenseClaimKind,
} from './expenseClaim.model';

import { ExpenseClaimModel } from './expenseClaim.model';
import {
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  RequestStatus,
} from '../../../../types';

async function createNewExpenseClaimService(
  expenseClaimData: ExpenseClaimSchema
): Promise<ExpenseClaimDocument> {
  try {
    const newExpenseClaim = await ExpenseClaimModel.create(expenseClaimData);
    return newExpenseClaim;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewExpenseClaimService' });
  }
}

async function getQueriedExpenseClaimsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<ExpenseClaimDocument>): Promise<
  Array<ExpenseClaimDocument>
> {
  try {
    const expenseClaims = await ExpenseClaimModel.find(filter, projection, options).lean().exec();
    return expenseClaims;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedExpenseClaimsService' });
  }
}

async function getQueriedTotalExpenseClaimsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<ExpenseClaimDocument>): Promise<number> {
  try {
    const totalExpenseClaims = await ExpenseClaimModel.countDocuments(filter).lean().exec();
    return totalExpenseClaims;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalExpenseClaimsService' });
  }
}

async function getQueriedExpenseClaimsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<ExpenseClaimDocument>): Promise<
  Array<ExpenseClaimDocument>
> {
  try {
    const expenseClaims = await ExpenseClaimModel.find(filter, projection, options).lean().exec();
    return expenseClaims;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedExpenseClaimsByUserService' });
  }
}

async function getExpenseClaimByIdService(
  expenseClaimId: Types.ObjectId | string
): Promise<ExpenseClaimDocument | null> {
  try {
    const expenseClaim = await ExpenseClaimModel.findById(expenseClaimId)
      .select('-__v')
      .lean()
      .exec();
    return expenseClaim;
  } catch (error: any) {
    throw new Error(error, { cause: 'getExpenseClaimByIdService' });
  }
}

async function updateExpenseClaimByIdService({
  expenseClaimId,
  fieldsToUpdate,
}: {
  expenseClaimId: Types.ObjectId | string;
  fieldsToUpdate: {
    [key in keyof ExpenseClaimDocument]?: ExpenseClaimDocument[key];
  };
}): DatabaseResponseNullable<ExpenseClaimDocument> {
  try {
    const expenseClaim = await ExpenseClaimModel.findByIdAndUpdate(
      expenseClaimId,
      { fieldsToUpdate },
      { new: true }
    )
      .select('-__v')
      .lean()
      .exec();
    return expenseClaim;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateExpenseClaimByIdService' });
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

async function returnAllUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const allUploadedFileIds = await ExpenseClaimModel.find({})
      .distinct('uploadedFileId')
      .lean()
      .exec();
    return allUploadedFileIds as Array<Types.ObjectId>;
  } catch (error: any) {
    throw new Error(error, { cause: 'returnAllUploadedFileIdsService' });
  }
}

async function deleteAnExpenseClaimService(
  expenseClaimId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deleteResult = await ExpenseClaimModel.deleteOne({ _id: expenseClaimId }).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteExpenseClaimByIdService' });
  }
}

export {
  createNewExpenseClaimService,
  getQueriedExpenseClaimsService,
  getQueriedExpenseClaimsByUserService,
  getExpenseClaimByIdService,
  getQueriedTotalExpenseClaimsService,
  deleteAllExpenseClaimsService,
  deleteAnExpenseClaimService,
  returnAllUploadedFileIdsService,
  updateExpenseClaimByIdService,
};
