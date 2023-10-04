import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type {
  AnonymousRequestDocument,
  AnonymousRequestKind,
  Urgency,
} from './anonymousRequest.model';

import { PhoneNumber, UserRoles } from '../../../user';
import { GetQueriedResourceRequest, RequestStatus } from '../../../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

// personally identifiable information is not stored in server for ALL anonymous requests - the userInfo obj is defined in the request body for consistency

interface CreateNewAnonymousRequestRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    anonymousRequest: {
      title: string;
      secureContactNumber: PhoneNumber;
      secureContactEmail: string;
      requestKind: AnonymousRequestKind;
      requestDescription: string;
      additionalInformation: string;
      urgency: Urgency;
    };
  };
}

// DEV ROUTE
interface CreateNewAnonymousRequestsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    anonymousRequests: {
      title: string;
      secureContactNumber: PhoneNumber;
      secureContactEmail: string;
      requestKind: AnonymousRequestKind;
      requestDescription: string;
      additionalInformation: string;
      urgency: Urgency;
      requestStatus: RequestStatus;
    }[];
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

type GetQueriedAnonymousRequestsRequest = GetQueriedResourceRequest;

interface GetAnAnonymousRequestRequest extends RequestAfterJWTVerification {
  params: {
    anonymousRequestId: string;
  };
}

interface UpdateAnonymousRequestStatusByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    anonymousRequest: {
      requestStatus: RequestStatus;
    };
  };
  params: {
    anonymousRequestId: string;
  };
}

export type {
  CreateNewAnonymousRequestRequest,
  CreateNewAnonymousRequestsBulkRequest,
  DeleteAnAnonymousRequestRequest,
  DeleteAllAnonymousRequestsRequest,
  GetQueriedAnonymousRequestsRequest,
  GetAnAnonymousRequestRequest,
  UpdateAnonymousRequestStatusByIdRequest,
};
