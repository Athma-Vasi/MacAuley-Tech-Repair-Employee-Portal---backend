import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type {
  AnonymousRequestDocument,
  AnonymousRequestSchema,
} from "./anonymousRequest.model";

import { AnonymousRequestModel } from "./anonymousRequest.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../../../types";

async function getAnonymousRequestByIdService(
  anonymousRequestId: Types.ObjectId | string
): DatabaseResponseNullable<AnonymousRequestDocument> {
  try {
    const anonymousRequest = await AnonymousRequestModel.findById(anonymousRequestId)
      .lean()
      .exec();
    return anonymousRequest;
  } catch (error: any) {
    throw new Error(error, { cause: "getAnonymousRequestByIdService" });
  }
}

async function createNewAnonymousRequestService(
  anonymousRequestSchema: AnonymousRequestSchema
): Promise<AnonymousRequestDocument> {
  try {
    const anonymousRequest = await AnonymousRequestModel.create(anonymousRequestSchema);
    return anonymousRequest;
  } catch (error: any) {
    throw new Error(error, { cause: "createNewAnonymousRequestService" });
  }
}

async function getQueriedAnonymousRequestsService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<AnonymousRequestDocument>): DatabaseResponse<AnonymousRequestDocument> {
  try {
    const anonymousRequest = await AnonymousRequestModel.find(filter, projection, options)
      .lean()
      .exec();
    return anonymousRequest;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedAnonymousRequestsService" });
  }
}

async function getQueriedTotalAnonymousRequestsService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<AnonymousRequestDocument>): Promise<number> {
  try {
    const totalAnonymousRequests = await AnonymousRequestModel.countDocuments(filter)
      .lean()
      .exec();
    return totalAnonymousRequests;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedTotalAnonymousRequestsService" });
  }
}

async function getQueriedAnonymousRequestsByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<AnonymousRequestDocument>): DatabaseResponse<AnonymousRequestDocument> {
  try {
    const anonymousRequests = await AnonymousRequestModel.find(
      filter,
      projection,
      options
    )
      .lean()
      .exec();
    return anonymousRequests;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedAnonymousRequestsByUserService" });
  }
}

async function updateAnonymousRequestByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<AnonymousRequestDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const anonymousRequest = await AnonymousRequestModel.findByIdAndUpdate(
      _id,
      updateObject,
      {
        new: true,
      }
    )
      .lean()
      .exec();
    return anonymousRequest;
  } catch (error: any) {
    throw new Error(error, { cause: "updateAnonymousRequestStatusByIdService" });
  }
}

async function deleteAnonymousRequestByIdService(
  anonymousRequestId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await AnonymousRequestModel.deleteOne({
      _id: anonymousRequestId,
    })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAnonymousRequestByIdService" });
  }
}

async function deleteAllAnonymousRequestsService(): Promise<DeleteResult> {
  try {
    const deletedResult = await AnonymousRequestModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAllAnonymousRequestsService" });
  }
}

export {
  getAnonymousRequestByIdService,
  createNewAnonymousRequestService,
  getQueriedAnonymousRequestsService,
  getQueriedTotalAnonymousRequestsService,
  getQueriedAnonymousRequestsByUserService,
  deleteAnonymousRequestByIdService,
  deleteAllAnonymousRequestsService,
  updateAnonymousRequestByIdService,
};
