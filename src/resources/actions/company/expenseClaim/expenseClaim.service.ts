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
import createHttpError from "http-errors";

async function getExpenseClaimByIdService(
  expenseClaimId: Types.ObjectId | string
): DatabaseResponseNullable<ExpenseClaimDocument> {
  try {
    const expenseClaim = await ExpenseClaimModel.findById(expenseClaimId).lean().exec();
    return expenseClaim;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("Error in getExpenseClaimByIdService");
  }
}

async function createNewExpenseClaimService(
  expenseClaimSchema: ExpenseClaimSchema
): Promise<ExpenseClaimDocument> {
  try {
    const expenseClaim = await ExpenseClaimModel.create(expenseClaimSchema);
    return expenseClaim;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in createNewExpenseClaimService"
    );
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
    throw new createHttpError.InternalServerError(
      "Error in getQueriedExpenseClaimsService"
    );
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
    throw new createHttpError.InternalServerError(
      "Error in getQueriedTotalExpenseClaimsService"
    );
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
    throw new createHttpError.InternalServerError(
      "Error in getQueriedExpenseClaimsByUserService"
    );
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
    throw new createHttpError.InternalServerError(
      "Error in updateExpenseClaimByIdService"
    );
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
    throw new createHttpError.InternalServerError(
      "Error in deleteExpenseClaimByIdService"
    );
  }
}

async function deleteAllExpenseClaimsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await ExpenseClaimModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError(
      "Error in deleteAllExpenseClaimsService"
    );
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
    throw new createHttpError.InternalServerError(
      "Error in returnAllExpenseClaimsUploadedFileIdsService"
    );
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
