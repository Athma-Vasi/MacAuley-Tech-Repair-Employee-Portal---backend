import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type { EndorsementDocument, EndorsementSchema } from "./endorsement.model";

import { EndorsementModel } from "./endorsement.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../../../types";
import createHttpError from "http-errors";

async function getEndorsementByIdService(
  endorsementId: Types.ObjectId | string
): DatabaseResponseNullable<EndorsementDocument> {
  try {
    const endorsement = await EndorsementModel.findById(endorsementId).lean().exec();
    return endorsement;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getEndorsementByIdService");
  }
}

async function createNewEndorsementService(
  endorsementSchema: EndorsementSchema
): Promise<EndorsementDocument> {
  try {
    const endorsement = await EndorsementModel.create(endorsementSchema);
    return endorsement;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("createNewEndorsementService");
  }
}

async function getQueriedEndorsementsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<EndorsementDocument>): DatabaseResponse<EndorsementDocument> {
  try {
    const endorsement = await EndorsementModel.find(filter, projection, options)
      .lean()
      .exec();
    return endorsement;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedEndorsementsService");
  }
}

async function getQueriedTotalEndorsementsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<EndorsementDocument>): Promise<number> {
  try {
    const totalEndorsements = await EndorsementModel.countDocuments(filter).lean().exec();
    return totalEndorsements;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedTotalEndorsementsService");
  }
}

async function getQueriedEndorsementsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<EndorsementDocument>): DatabaseResponse<EndorsementDocument> {
  try {
    const endorsements = await EndorsementModel.find(filter, projection, options)
      .lean()
      .exec();
    return endorsements;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("getQueriedEndorsementsByUserService");
  }
}

async function updateEndorsementByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<EndorsementDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const endorsement = await EndorsementModel.findByIdAndUpdate(_id, updateObject, {
      new: true,
    })
      .lean()
      .exec();
    return endorsement;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("updateEndorsementStatusByIdService");
  }
}

async function deleteEndorsementByIdService(
  endorsementId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await EndorsementModel.deleteOne({
      _id: endorsementId,
    })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteEndorsementByIdService");
  }
}

async function deleteAllEndorsementsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await EndorsementModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new createHttpError.InternalServerError("deleteAllEndorsementsService");
  }
}

export {
  getEndorsementByIdService,
  createNewEndorsementService,
  getQueriedEndorsementsService,
  getQueriedTotalEndorsementsService,
  getQueriedEndorsementsByUserService,
  deleteEndorsementByIdService,
  deleteAllEndorsementsService,
  updateEndorsementByIdService,
};
