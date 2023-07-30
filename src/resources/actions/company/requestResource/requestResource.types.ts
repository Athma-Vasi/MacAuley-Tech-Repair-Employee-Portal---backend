import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { RequestResourceKind, RequestResourceSchema } from './requestResource.model';
import type { Urgency } from '../../general/printerIssue';
import type { Department, UserRoles } from '../../../user';

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

type GetAllRequestResourcesRequest = RequestAfterJWTVerification;

interface GetRequestResourceByIdRequest extends RequestAfterJWTVerification {
  params: {
    requestResourceId: string;
  };
}

type GetRequestResourcesByUserRequest = RequestAfterJWTVerification;

type RequestResourcesServerResponse = {
  message: string;
  requestResourceData: Array<RequestResourceSchema>;
};

export type {
  CreateNewRequestResourceRequest,
  DeleteARequestResourceRequest,
  DeleteAllRequestResourcesRequest,
  GetAllRequestResourcesRequest,
  GetRequestResourceByIdRequest,
  GetRequestResourcesByUserRequest,
  RequestResourcesServerResponse,
};
