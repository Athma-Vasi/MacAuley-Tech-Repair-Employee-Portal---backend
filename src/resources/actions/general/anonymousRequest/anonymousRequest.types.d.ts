import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { ActionsGeneral } from '../actionsGeneral.types';
import type { AnonymousRequestKind, AnonymousRequestUrgency } from './anonymousRequest.model';

import { UserRoles } from '../../../user';

interface CreateNewAnonymousRequestRequest extends RequestAfterJWTVerification {
  body: {
    //  we are not decoding userInfo from JWT because we want to allow anonymous requests
    title: ActionsGeneral;
    secureContactNumber: string;
    secureContactEmail: string;
    requestKind: AnonymousRequestKind;
    requestDescription: string;
    additionalInformation: string;
    urgency: AnonymousRequestUrgency;
  };
}

interface DeleteAnAnonymousRequestRequest extends RequestAfterJWTVerification {
  body: {
    // only managers can delete anonymous requests and this userInfo object is decoded from JWT
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: {
    anonymousRequestId: Types.ObjectId;
  };
}

interface DeleteAllAnonymousRequestsRequest extends RequestAfterJWTVerification {
  body: {
    // only managers can delete an anonymous request and this userInfo object is decoded from JWT
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
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
  DeleteAllAnonymousRequestsRequest,
  GetAllAnonymousRequestsRequest,
  GetAnAnonymousRequestRequest,
};
