import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { UserRoles } from '../../../user';
import type { BenefitsPlanKind, Currency } from './benefits.model';
import { GetQueriedResourceRequest, RequestStatus } from '../../../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface CreateNewBenefitsRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    benefit: {
      username: string;
      planName: string;
      planDescription: string;
      planKind: BenefitsPlanKind;
      planStartDate: string;
      isPlanActive: boolean;
      currency: Currency;
      monthlyPremium: number;
      employerContribution: number;
      employeeContribution: number;
    };
  };
}

interface DeleteABenefitRequest extends RequestAfterJWTVerification {
  params: {
    benefitsId: string;
  };
}

type DeleteAllBenefitsByUserRequest = RequestAfterJWTVerification;

type GetQueriedBenefitsRequest = GetQueriedResourceRequest;

type GetQueriedBenefitsByUserRequest = GetQueriedResourceRequest;

interface GetBenefitsByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { benefitsId: string };
}

interface UpdateBenefitsStatusByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    benefit: {
      requestStatus: RequestStatus;
    };
  };
  params: { benefitId: string };
}

export type {
  CreateNewBenefitsRequest,
  DeleteABenefitRequest,
  DeleteAllBenefitsByUserRequest,
  GetQueriedBenefitsRequest,
  GetQueriedBenefitsByUserRequest,
  GetBenefitsByIdRequest,
  UpdateBenefitsStatusByIdRequest,
};
