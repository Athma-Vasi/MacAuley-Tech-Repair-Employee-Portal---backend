import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { EmployeeAttributes, EndorsementDocument } from './endorsement.model';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewEndorsementRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: string[];
    };
    // below are the fields required to be sent with post request
    section: 'company' | 'general';
    title: 'endorsement';
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
      roles: string[];
    };
    section: 'company' | 'general';
    title: 'endorsement';
    userToBeEndorsed: string;
    summaryOfEndorsement: string;
    attributeEndorsed: EmployeeAttributes;
  };
  params: {
    endorsementId: Types.ObjectId;
  };
}

interface DeleteEndorsementRequest extends RequestAfterJWTVerification {
  params: {
    endorsementId: Types.ObjectId;
  };
}

type DeleteAllEndorsementsRequest = RequestAfterJWTVerification;

type GetAllEndorsementsRequest = RequestAfterJWTVerification;

interface GetAnEndorsementRequest extends RequestAfterJWTVerification {
  params: {
    endorsementId: Types.ObjectId;
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
