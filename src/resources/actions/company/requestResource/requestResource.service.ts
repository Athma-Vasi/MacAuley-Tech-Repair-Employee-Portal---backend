import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type {
  RequestResourceDocument,
  RequestResourceSchema,
} from "./requestResource.model";

import { RequestResourceModel } from "./requestResource.model";
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
  UpdateDocumentByIdServiceInput,
} from "../../../../types";

async function getRequestResourceByIdService(
  requestResourceId: Types.ObjectId | string
): DatabaseResponseNullable<RequestResourceDocument> {
  try {
    const requestResource = await RequestResourceModel.findById(requestResourceId)
      .lean()
      .exec();
    return requestResource;
  } catch (error: any) {
    throw new Error(error, { cause: "getRequestResourceByIdService" });
  }
}

async function createNewRequestResourceService(
  requestResourceSchema: RequestResourceSchema
): Promise<RequestResourceDocument> {
  try {
    const requestResource = await RequestResourceModel.create(requestResourceSchema);
    return requestResource;
  } catch (error: any) {
    throw new Error(error, { cause: "createNewRequestResourceService" });
  }
}

async function getQueriedRequestResourcesService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RequestResourceDocument>): DatabaseResponse<RequestResourceDocument> {
  try {
    const requestResource = await RequestResourceModel.find(filter, projection, options)
      .lean()
      .exec();
    return requestResource;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedRequestResourcesService" });
  }
}

async function getQueriedTotalRequestResourcesService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<RequestResourceDocument>): Promise<number> {
  try {
    const totalRequestResources = await RequestResourceModel.countDocuments(filter)
      .lean()
      .exec();
    return totalRequestResources;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedTotalRequestResourcesService" });
  }
}

async function getQueriedRequestResourcesByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<RequestResourceDocument>): DatabaseResponse<RequestResourceDocument> {
  try {
    const requestResources = await RequestResourceModel.find(filter, projection, options)
      .lean()
      .exec();
    return requestResources;
  } catch (error: any) {
    throw new Error(error, { cause: "getQueriedRequestResourcesByUserService" });
  }
}

async function updateRequestResourceByIdService({
  _id,
  fields,
  updateOperator,
}: UpdateDocumentByIdServiceInput<RequestResourceDocument>) {
  const updateString = `{ "${updateOperator}":  ${JSON.stringify(fields)} }`;
  const updateObject = JSON.parse(updateString);

  try {
    const requestResource = await RequestResourceModel.findByIdAndUpdate(
      _id,
      updateObject,
      {
        new: true,
      }
    )
      .lean()
      .exec();
    return requestResource;
  } catch (error: any) {
    throw new Error(error, { cause: "updateRequestResourceStatusByIdService" });
  }
}

async function deleteRequestResourceByIdService(
  requestResourceId: Types.ObjectId | string
): Promise<DeleteResult> {
  try {
    const deletedResult = await RequestResourceModel.deleteOne({ _id: requestResourceId })
      .lean()
      .exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteRequestResourceByIdService" });
  }
}

async function deleteAllRequestResourcesService(): Promise<DeleteResult> {
  try {
    const deletedResult = await RequestResourceModel.deleteMany({}).lean().exec();
    return deletedResult;
  } catch (error: any) {
    throw new Error(error, { cause: "deleteAllRequestResourcesService" });
  }
}

export {
  getRequestResourceByIdService,
  createNewRequestResourceService,
  getQueriedRequestResourcesService,
  getQueriedTotalRequestResourcesService,
  getQueriedRequestResourcesByUserService,
  deleteRequestResourceByIdService,
  deleteAllRequestResourcesService,
  updateRequestResourceByIdService,
};
