import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { EmployeeAttributes, EndorsementDocument } from './endorsement.model';
import type { UserRoles } from '../../../user';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewEndorsementRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    // below are the fields required to be sent with post request
    title: string;
    userToBeEndorsed: string;
    summaryOfEndorsement: string;
    attributeEndorsed: EmployeeAttributes;
  };
}

interface UpdateAnEndorsementRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    title: string;
    userToBeEndorsed: string;
    summaryOfEndorsement: string;
    attributeEndorsed: EmployeeAttributes;
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

type GetAllEndorsementsRequest = RequestAfterJWTVerification;

interface GetAnEndorsementRequest extends RequestAfterJWTVerification {
  params: {
    endorsementId: string;
  };
}

type GetEndorsementsFromUserRequest = RequestAfterJWTVerification;

type EndorsementsServerResponse = {
  message: string;
  endorsementData: Array<EndorsementDocument>;
};

export type {
  CreateNewEndorsementRequest,
  DeleteEndorsementRequest,
  DeleteAllEndorsementsRequest,
  GetAllEndorsementsRequest,
  GetAnEndorsementRequest,
  GetEndorsementsFromUserRequest,
  EndorsementsServerResponse,
  UpdateAnEndorsementRequest,
};
