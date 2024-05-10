import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { BenefitDocument, BenefitSchema } from "./benefit.model";

import { BenefitModel } from "./benefit.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../../../types";
import createHttpError from "http-errors";

async function getBenefitByIdService(
  benefitId: Types.ObjectId | string
): DatabaseResponseNullable<BenefitDocument> {
  try {
    const benefit = await BenefitModel.findById(benefitId).lean().exec();
    return benefit;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getBenefitByIdService");
  }
}

async function createNewBenefitService(
  benefitSchema: BenefitSchema
): Promise<BenefitDocument> {
  try {
    const benefit = await BenefitModel.create(benefitSchema);
    return benefit;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewBenefitService");
  }
}

async function getQueriedBenefitsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<BenefitDocument>): DatabaseResponse<BenefitDocument> {
  try {
    const benefit = await BenefitModel.find(filter, projection, options).lean().exec();
    return benefit;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedBenefitsService");
  }
}

async function getQueriedTotalBenefitsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<BenefitDocument>): Promise<number> {
  try {
    const totalBenefits = await BenefitModel.countDocuments(filter).lean().exec();
    return totalBenefits;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalBenefitsService");
  }
}

async function getQueriedBenefitsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<BenefitDocument>): DatabaseResponse<BenefitDocument> {
  try {
    const benefits = await BenefitModel.find(filter, projection, options).lean().exec();
    return benefits;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedBenefitsByUserService");
  }
}

async function updateBenefitByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<BenefitDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const benefit = await BenefitModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return benefit;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateBenefitByIdService");
  }
}

async function deleteBenefitByIdService(
  benefitId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await BenefitModel.deleteOne({ _id: benefitId }).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteBenefitByIdService");
  }
}

async function deleteAllBenefitsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await BenefitModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllBenefitsService");
  }
}

export {
  getBenefitByIdService,
  createNewBenefitService,
  getQueriedBenefitsService,
  getQueriedTotalBenefitsService,
  getQueriedBenefitsByUserService,
  deleteBenefitByIdService,
  deleteAllBenefitsService,
  updateBenefitByIdService,
};
