import type { Request } from 'express';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { Types } from 'mongoose';
import type { EmployeeAttributes } from './index';

interface CreateNewEndorsementRequest extends RequestAfterJWTVerification {
  body: {
    user: Types.ObjectId;
    section: 'company' | 'general';
    title: 'endorsement';
    username: string;
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
