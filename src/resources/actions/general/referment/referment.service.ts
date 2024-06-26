import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { RefermentDocument, RefermentSchema } from "./referment.model";

import { RefermentModel } from "./referment.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../../../types";
import createHttpError from "http-errors";

async function getRefermentByIdService(
  refermentId: Types.ObjectId | string
): DatabaseResponseNullable<RefermentDocument> {
  try {
    const referment = await RefermentModel.findById(refermentId).lean().exec();
    return referment;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getRefermentByIdService");
  }
}

async function createNewRefermentService(
  refermentSchema: RefermentSchema
): Promise<RefermentDocument> {
  try {
    const referment = await RefermentModel.create(refermentSchema);
    return referment;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewRefermentService");
  }
}

async function getQueriedRefermentsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RefermentDocument>): DatabaseResponse<RefermentDocument> {
  try {
    const referment = await RefermentModel.find(filter, projection, options)
      .lean()
      .exec();
    return referment;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedRefermentsService");
  }
}

async function getQueriedTotalRefermentsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<RefermentDocument>): Promise<number> {
  try {
    const totalReferments = await RefermentModel.countDocuments(filter).lean().exec();
    return totalReferments;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalRefermentsService");
  }
}

async function getQueriedRefermentsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RefermentDocument>): DatabaseResponse<RefermentDocument> {
  try {
    const referments = await RefermentModel.find(filter, projection, options)
      .lean()
      .exec();
    return referments;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedRefermentsByUserService");
  }
}

async function updateRefermentByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<RefermentDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const referment = await RefermentModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return referment;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateRefermentStatusByIdService");
  }
}

async function deleteRefermentByIdService(
  refermentId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await RefermentModel.deleteOne({
      _id: refermentId,
    })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteRefermentByIdService");
  }
}

async function deleteAllRefermentsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await RefermentModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllRefermentsService");
  }
}

export {
  getRefermentByIdService,
  createNewRefermentService,
  getQueriedRefermentsService,
  getQueriedTotalRefermentsService,
  getQueriedRefermentsByUserService,
  deleteRefermentByIdService,
  deleteAllRefermentsService,
  updateRefermentByIdService,
};
