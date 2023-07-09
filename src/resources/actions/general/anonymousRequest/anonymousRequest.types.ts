import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { ActionsGeneral } from '../actionsGeneral.types';
import type {
  AnonymousRequestDocument,
  AnonymousRequestKind,
  AnonymousRequestUrgency,
} from './anonymousRequest.model';

import { UserRoles } from '../../../user';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

// personally identifiable information is not stored in server for ALL anonymous requests - the userInfo obj is defined in the request body for consistency

interface CreateNewAnonymousRequestRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
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
    // only managers can delete anonymous requests
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: {
    anonymousRequestId: string;
  };
}

interface DeleteAllAnonymousRequestsRequest extends RequestAfterJWTVerification {
  body: {
    // only managers can delete an anonymous request
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
    anonymousRequestId: string;
  };
}

type AnonymousRequestsServerResponse = {
  message: string;
  anonymousRequestData: Array<AnonymousRequestDocument>;
};

export type {
  CreateNewAnonymousRequestRequest,
  DeleteAnAnonymousRequestRequest,
  DeleteAllAnonymousRequestsRequest,
  GetAllAnonymousRequestsRequest,
  GetAnAnonymousRequestRequest,
  AnonymousRequestsServerResponse,
};
