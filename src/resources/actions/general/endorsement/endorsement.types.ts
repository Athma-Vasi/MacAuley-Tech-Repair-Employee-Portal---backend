import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { EmployeeAttributes, EndorsementDocument } from './endorsement.model';
import type { UserRoles } from '../../../user';
import { GetQueriedResourceRequest, RequestStatus } from '../../../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewEndorsementRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    // below are the fields required to be sent with post request
    endorsement: {
      title: string;
      userToBeEndorsed: string;
      summaryOfEndorsement: string;
      attributeEndorsed: EmployeeAttributes;
    };
  };
}

// DEV ROUTE
interface CreateNewEndorsementsBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    endorsements: {
      userId: Types.ObjectId;
      username: string;
      title: string;
      userToBeEndorsed: string;
      summaryOfEndorsement: string;
      attributeEndorsed: EmployeeAttributes;
      requestStatus: RequestStatus;
    }[];
  };
}

interface UpdateEndorsementStatusByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    endorsement: {
      requestStatus: RequestStatus;
    };
  };
  params: {
    endorsementId: string;
  };
}

interface DeleteEndorsementRequest extends RequestAfterJWTVerification {
  params: {
    endorsementId: string;
  };
}

type DeleteAllEndorsementsRequest = RequestAfterJWTVerification;

type GetQueriedEndorsementsRequest = GetQueriedResourceRequest;

interface GetAnEndorsementRequest extends RequestAfterJWTVerification {
  params: {
    endorsementId: string;
  };
}

type GetQueriedEndorsementsByUserRequest = GetQueriedResourceRequest;

export type {
  CreateNewEndorsementRequest,
  CreateNewEndorsementsBulkRequest,
  DeleteEndorsementRequest,
  DeleteAllEndorsementsRequest,
  GetQueriedEndorsementsRequest,
  GetAnEndorsementRequest,
  GetQueriedEndorsementsByUserRequest,
  UpdateEndorsementStatusByIdRequest,
};
