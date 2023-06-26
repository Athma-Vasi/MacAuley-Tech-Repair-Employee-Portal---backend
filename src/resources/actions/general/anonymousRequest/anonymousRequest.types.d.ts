import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { ActionsGeneral } from '../actionsGeneral.types';
import type { AnonymousRequestUrgency } from './anonymousRequest.model';
import { UserRoles } from '../../../user';

interface CreateNewAnonymousRequestRequest extends RequestAfterJWTVerification {
  body: {
    title: ActionsGeneral;
    secureContactNumber: string;
    secureContactEmail: string;
    requestType: string;
    requestDescription: string;
    additionalInformation: string;
    urgency: AnonymousRequestUrgency;
  };
}

interface DeleteAnAnonymousRequestRequest extends RequestAfterJWTVerification {
  params: {
    anonymousRequestId: Types.ObjectId;
  };
}

type GetAllAnonymousRequestsRequest = RequestAfterJWTVerification;

interface GetAnAnonymousRequestRequest extends RequestAfterJWTVerification {
  params: {
    anonymousRequestId: Types.ObjectId;
  };
}

export type {
  CreateNewAnonymousRequestRequest,
  DeleteAnAnonymousRequestRequest,
  GetAllAnonymousRequestsRequest,
  GetAnAnonymousRequestRequest,
};
