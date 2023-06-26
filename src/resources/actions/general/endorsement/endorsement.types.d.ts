import type { Request } from 'express';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { Types } from 'mongoose';
import type { EmployeeAttributes } from './index';

interface CreateNewEndorsementRequest extends RequestAfterJWTVerification {
  body: {
    // userInfo object is decoded from the JWT in the auth middleware: verifyJWT.ts
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

export type {
  CreateNewEndorsementRequest,
  DeleteEndorsementRequest,
  DeleteAllEndorsementsRequest,
  GetAllEndorsementsRequest,
  GetAnEndorsementRequest,
  GetEndorsementsFromUserRequest,
};
