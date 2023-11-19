import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../../auth';
import { UserRoles } from '../../../../user';
import { GetQueriedResourceRequest } from '../../../../../types';

import { FileUploadDocument } from '../../../../fileUpload';
import { ComputerCaseDocument, ComputerCaseSchema } from './computerCase.model';

interface CreateNewComputerCaseRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    computerCaseSchema: Omit<ComputerCaseSchema, 'userId' | 'username'>;
  };
}

// DEV ROUTE
interface CreateNewComputerCaseBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    computerCaseSchema: ComputerCaseSchema[];
  };
}

interface DeleteAComputerCaseRequest extends RequestAfterJWTVerification {
  params: { computerCaseId: string };
}

type DeleteAllComputerCasesRequest = RequestAfterJWTVerification;

type GetQueriedComputerCasesRequest = GetQueriedResourceRequest;

interface GetComputerCaseByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { computerCaseId: string };
}

interface UpdateComputerCaseByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    computerCaseFields: Record<
      keyof ComputerCaseSchema,
      ComputerCaseSchema[keyof ComputerCaseSchema]
    >;
  };
  params: { computerCaseId: string };
}

export type {
  CreateNewComputerCaseRequest,
  CreateNewComputerCaseBulkRequest,
  DeleteAComputerCaseRequest,
  DeleteAllComputerCasesRequest,
  GetComputerCaseByIdRequest,
  GetQueriedComputerCasesRequest,
  UpdateComputerCaseByIdRequest,
};
