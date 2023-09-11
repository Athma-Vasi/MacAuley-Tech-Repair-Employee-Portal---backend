import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type { RequestResourceDocument, RequestResourceSchema } from './requestResource.model';
import {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  RequestStatus,
} from '../../../../types';

import { RequestResourceModel } from './requestResource.model';

async function createNewRequestResourceService(
  requestResourceData: RequestResourceSchema
): Promise<RequestResourceDocument> {
  try {
    const newRequestResource = await RequestResourceModel.create(requestResourceData);
    return newRequestResource;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewRequestResourceService' });
  }
}

async function getQueriedRequestResourceService({
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
    throw new Error(error, { cause: 'getQueriedRequestResourceService' });
  }
}

async function getQueriedTotalRequestResourceService({
  filter = {},
}: QueriedResourceGetRequestServiceInput<RequestResourceDocument>): Promise<number> {
  try {
    const totalResourceRequests = await RequestResourceModel.countDocuments(filter).lean().exec();
    return totalResourceRequests;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalRequestResourceService' });
  }
}

async function getQueriedRequestResourceByUserService({
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
    throw new Error(error, { cause: 'getQueriedRequestResourceByUserService' });
  }
}

async function getRequestResourceByIdService(
  requestResourceId: string
): DatabaseResponseNullable<RequestResourceDocument> {
  try {
    const resourceRequest = await RequestResourceModel.findById(requestResourceId).lean().exec();
    return resourceRequest;
  } catch (error: any) {
    throw new Error(error, { cause: 'getRequestResourceByIdService' });
  }
}

async function updateRequestResourceStatusByIdService({
  requestResourceId,
  requestStatus,
}: {
  requestResourceId: Types.ObjectId | string;
  requestStatus: RequestStatus;
}) {
  try {
    const requestResource = await RequestResourceModel.findByIdAndUpdate(
      requestResourceId,
      { requestStatus },
      { new: true }
    )
      .select(['-__v', '-action', '-category'])
      .lean()
      .exec();
    return requestResource;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateRequestResourceStatusByIdService' });
  }
}

async function deleteARequestResourceService(requestResourceId: string): Promise<DeleteResult> {
  try {
    const deleteResult = await RequestResourceModel.deleteOne({ _id: requestResourceId })
      .lean()
      .exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteARequestResourceService' });
  }
}

async function deleteAllRequestResourcesService(): Promise<DeleteResult> {
  try {
    const deleteResult = await RequestResourceModel.deleteMany({}).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllRequestResourcesService' });
  }
}

export {
  createNewRequestResourceService,
  deleteARequestResourceService,
  deleteAllRequestResourcesService,
  getQueriedRequestResourceService,
  getRequestResourceByIdService,
  getQueriedRequestResourceByUserService,
  getQueriedTotalRequestResourceService,
  updateRequestResourceStatusByIdService,
};
