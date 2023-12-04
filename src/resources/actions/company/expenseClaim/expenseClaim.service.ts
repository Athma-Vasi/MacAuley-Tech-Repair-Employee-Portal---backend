import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { ExpenseClaimDocument, ExpenseClaimSchema } from "./expenseClaim.model";

import { ExpenseClaimModel } from "./expenseClaim.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../../../types";

async function getExpenseClaimByIdService(
  expenseClaimId: Types.ObjectId | string
): DatabaseResponseNullable<ExpenseClaimDocument> {
  try {
    const expenseClaim = await ExpenseClaimModel.findById(expenseClaimId).lean().exec();
    return expenseClaim;
  } catch (error: any) {
    throw new Error(error, { cause: "getExpenseClaimByIdService" });
  }
}

async function createNewExpenseClaimService(
  expenseClaimSchema: ExpenseClaimSchema
): Promise<ExpenseClaimDocument> {
  try {
    const expenseClaim = await ExpenseClaimModel.create(expenseClaimSchema);
    return expenseClaim;
  } catch (error: any) {
    throw new Error(error, { cause: "createNewExpenseClaimService" });
  }
}

async function getQueriedExpenseClaimsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<ExpenseClaimDocument>): DatabaseResponse<ExpenseClaimDocument> {
  try {
    const expenseClaim = await ExpenseClaimModel.find(filter, projection, options)
      .lean()
      .exec();
    return expenseClaim;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedExpenseClaimsService" });
  }
}

async function getQueriedTotalExpenseClaimsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<ExpenseClaimDocument>): Promise<number> {
  try {
    const totalExpenseClaims = await ExpenseClaimModel.countDocuments(filter)
      .lean()
      .exec();
    return totalExpenseClaims;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedTotalExpenseClaimsService" });
  }
}

async function getQueriedExpenseClaimsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<ExpenseClaimDocument>): DatabaseResponse<ExpenseClaimDocument> {
  try {
    const expenseClaims = await ExpenseClaimModel.find(filter, projection, options)
      .lean()
      .exec();
    return expenseClaims;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedExpenseClaimsByUserService" });
  }
}

async function updateExpenseClaimByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<ExpenseClaimDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const expenseClaim = await ExpenseClaimModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return expenseClaim;
  } catch (error: any) {
    throw new Error(error, { cause: "updateExpenseClaimStatusByIdService" });
  }
}

async function deleteExpenseClaimByIdService(
  expenseClaimId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await ExpenseClaimModel.deleteOne({ _id: expenseClaimId })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteExpenseClaimByIdService" });
  }
}

async function deleteAllExpenseClaimsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await ExpenseClaimModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAllExpenseClaimsService" });
  }
}

async function returnAllExpenseClaimsUploadedFileIdsService(): Promise<Types.ObjectId[]> {
  try {
    const expenseClaims = await ExpenseClaimModel.find({})
      .select("uploadedFilesIds")
      .lean()
      .exec();
    const uploadedFileIds = expenseClaims.flatMap(
      (expenseClaim) => expenseClaim.uploadedFilesIds
    );
    return uploadedFileIds;
  } catch (error: any) {
    throw new Error(error, { cause: "returnAllExpenseClaimsUploadedFileIdsService" });
  }
}

export {
  getExpenseClaimByIdService,
  createNewExpenseClaimService,
  getQueriedExpenseClaimsService,
  getQueriedTotalExpenseClaimsService,
  getQueriedExpenseClaimsByUserService,
  deleteExpenseClaimByIdService,
  deleteAllExpenseClaimsService,
  updateExpenseClaimByIdService,
  returnAllExpenseClaimsUploadedFileIdsService,
};
