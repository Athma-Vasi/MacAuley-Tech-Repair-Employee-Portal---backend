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
    id: Types.ObjectId;
  };
}

// rome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface GetAllEndorsementsRequest extends RequestAfterJWTVerification {}

interface GetAnEndorsementRequest extends RequestAfterJWTVerification {
  params: {
    id: Types.ObjectId;
  };
}

// rome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface GetEndorsementsFromUserRequest extends RequestAfterJWTVerification {}

export type {
  CreateNewEndorsementRequest,
  DeleteEndorsementRequest,
  GetAllEndorsementsRequest,
  GetAnEndorsementRequest,
  GetEndorsementsFromUserRequest,
};
