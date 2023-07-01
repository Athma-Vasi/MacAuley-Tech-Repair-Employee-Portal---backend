import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { ExpenseClaimType, Currency } from './expenseClaim.model';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface CreateNewExpenseClaimRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    expenseClaim: {
      uploadedFileId: Types.ObjectId;
      expenseClaimType: ExpenseClaimType;
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
    expenseClaimId: Types.ObjectId;
  };
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    uploadedFileId: Types.ObjectId;
  };
}

type DeleteAllExpenseClaimsRequest = RequestAfterJWTVerification;

type GetAllExpenseClaimsRequest = RequestAfterJWTVerification;

type GetExpenseClaimsByUserRequest = RequestAfterJWTVerification;

interface GetExpenseClaimByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { expenseClaimId: Types.ObjectId };
}

type ExpenseClaimServerResponse = {
  message: string;
  expenseClaimData: Array<ExpenseClaimDocument>;
};

export type {
  CreateNewExpenseClaimRequest,
  DeleteAnExpenseClaimRequest,
  DeleteAllExpenseClaimsRequest,
  GetAllExpenseClaimsRequest,
  GetExpenseClaimsByUserRequest,
  GetExpenseClaimByIdRequest,
  ExpenseClaimServerResponse,
};
