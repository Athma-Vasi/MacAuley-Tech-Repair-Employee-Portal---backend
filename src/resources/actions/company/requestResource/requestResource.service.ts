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
    const deleteResult = await RequestResourceModel.deleteOne({ _id: requestResourceId });
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteARequestResourceService' });
  }
}

export { createNewRequestResourceService, deleteARequestResourceService };
