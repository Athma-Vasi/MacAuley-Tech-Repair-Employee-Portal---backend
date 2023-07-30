import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { RequestResourceKind, RequestResourceSchema } from './requestResource.model';
import type { Urgency } from '../../general/printerIssue';
import type { Department, UserRoles } from '../../../user';
import { GetQueriedResourceRequest, RequestStatus } from '../../../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewRequestResourceRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    requestResource: {
      department: Department;
      resourceType: RequestResourceKind;
      resourceQuantity: number;
      resourceDescription: string;
      reasonForRequest: string;
      urgency: Urgency;
      dateNeededBy: NativeDate;
      additionalInformation: string;
    };
  };
}

interface DeleteARequestResourceRequest extends RequestAfterJWTVerification {
  params: {
    requestResourceId: string;
  };
}

type DeleteAllRequestResourcesRequest = RequestAfterJWTVerification;

type GetQueriedRequestResourcesRequest = GetQueriedResourceRequest;

type GetQueriedRequestResourcesByUserRequest = GetQueriedResourceRequest;

interface GetRequestResourceByIdRequest extends RequestAfterJWTVerification {
  params: {
    requestResourceId: string;
  };
}

interface UpdateRequestResourceStatusByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    requestResource: {
      requestStatus: RequestStatus;
    };
  };
  params: {
    requestResourceId: string;
  };
}

export type {
  CreateNewRequestResourceRequest,
  DeleteARequestResourceRequest,
  DeleteAllRequestResourcesRequest,
  GetQueriedRequestResourcesRequest,
  GetRequestResourceByIdRequest,
  GetQueriedRequestResourcesByUserRequest,
  UpdateRequestResourceStatusByIdRequest,
};
