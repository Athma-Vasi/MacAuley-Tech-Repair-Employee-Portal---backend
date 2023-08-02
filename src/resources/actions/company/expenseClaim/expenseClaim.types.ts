import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { ExpenseClaimKind, Currency, ExpenseClaimDocument } from './expenseClaim.model';
import { UserRoles } from '../../../user';
import { GetQueriedResourceRequest, RequestStatus } from '../../../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface CreateNewExpenseClaimRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    expenseClaim: {
      uploadedFilesIds: Types.ObjectId[];
      expenseClaimKind: ExpenseClaimKind;
      expenseClaimAmount: number;
      expenseClaimCurrency: Currency;
      expenseClaimDate: NativeDate;
      expenseClaimDescription: string;
      additionalComments: string;
      acknowledgement: boolean;
    };
  };
}

interface DeleteAnExpenseClaimRequest extends RequestAfterJWTVerification {
  params: {
    expenseClaimId: string;
  };
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    uploadedFilesIds: Types.ObjectId[];
  };
}

type DeleteAllExpenseClaimsRequest = RequestAfterJWTVerification;

type GetQueriedExpenseClaimsRequest = GetQueriedResourceRequest;

type GetQueriedExpenseClaimsByUserRequest = GetQueriedResourceRequest;

interface GetExpenseClaimByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { expenseClaimId: string };
}

interface UpdateExpenseClaimStatusByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    expenseClaim: {
      requestStatus: RequestStatus;
    };
  };
  params: { expenseClaimId: string };
}

interface UpdateExpenseClaimByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    expenseClaim: {
      uploadedFilesIds: Types.ObjectId[];
      expenseClaimKind: ExpenseClaimKind;
      expenseClaimAmount: number;
      expenseClaimCurrency: Currency;
      expenseClaimDate: NativeDate;
      expenseClaimDescription: string;
      additionalComments: string;
      acknowledgement: boolean;
    };
  };
  params: { expenseClaimId: string };
}

export type {
  CreateNewExpenseClaimRequest,
  DeleteAnExpenseClaimRequest,
  DeleteAllExpenseClaimsRequest,
  GetQueriedExpenseClaimsRequest,
  GetQueriedExpenseClaimsByUserRequest,
  GetExpenseClaimByIdRequest,
  UpdateExpenseClaimStatusByIdRequest,
  UpdateExpenseClaimByIdRequest,
};
