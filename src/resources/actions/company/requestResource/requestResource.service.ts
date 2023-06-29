import type { FlattenMaps, Types } from 'mongoose';
import type { DeleteResult } from 'mongodb';
import type {
  RequestResourceDocument,
  RequestResourceKind,
  RequestResourceSchema,
} from './requestResource.model';
import { DatabaseResponse, DatabaseResponseNullable } from '../../../../types';

import { RequestResourceModel } from './requestResource.model';
import { Department } from '../../../user';
import { Urgency } from '../../general/printerIssue';

type CreateNewRequestResourceServiceInput = {
  userId: Types.ObjectId;
  username: string;
  department: Department;
  resourceType: RequestResourceKind;
  resourceQuantity: number;
  resourceDescription: string;
  reasonForRequest: string;
  urgency: Urgency;
  dateNeededBy: NativeDate;
  additionalInformation: string;
};

async function createNewRequestResourceService(
  requestResourceData: CreateNewRequestResourceServiceInput
) {
  try {
    const newRequestResource = await RequestResourceModel.create(requestResourceData);
    return newRequestResource;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewRequestResourceService' });
  }
}

async function deleteARequestResourceService(
  requestResourceId: Types.ObjectId
): Promise<DeleteResult> {
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

async function getAllRequestResourcesService(): Promise<
  (FlattenMaps<RequestResourceSchema> & {
    _id: Types.ObjectId;
  })[]
> {
  try {
    const requestResources = await RequestResourceModel.find({}).lean().exec();
    return requestResources;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllRequestResourcesService' });
  }
}

export {
  createNewRequestResourceService,
  deleteARequestResourceService,
  deleteAllRequestResourcesService,
  getAllRequestResourcesService,
};
