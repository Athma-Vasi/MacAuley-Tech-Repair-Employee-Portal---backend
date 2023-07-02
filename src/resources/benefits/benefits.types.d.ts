import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../auth';
import type { UserRoles } from '../user';
import type { BenefitsDocument, BenefitsPlanKind } from './benefits.model';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface CreateNewBenefitsRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    benefits: {
      planName: string;
      planDescription: string;
      planKind: BenefitsPlanKind;
      planStartDate: NativeDate;
      isPlanActive: boolean;
      monthlyPremium: number;
      employerContribution: number;
      employeeContribution: number;
    };
  };
}

interface DeleteABenefitRequest extends RequestAfterJWTVerification {
  params: {
    benefitsId: Types.ObjectId;
  };
}

type DeleteAllBenefitsRequest = RequestAfterJWTVerification;

type GetAllBenefitsRequest = RequestAfterJWTVerification;

type GetBenefitsByUserRequest = RequestAfterJWTVerification;

interface GetBenefitsByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { benefitsId: Types.ObjectId };
}

type BenefitsServerResponse = {
  message: string;
  benefitsData: Array<BenefitsDocument>;
};

export type {
  CreateNewBenefitsRequest,
  DeleteABenefitRequest,
  DeleteAllBenefitsRequest,
  GetAllBenefitsRequest,
  GetBenefitsByUserRequest,
  GetBenefitsByIdRequest,
  BenefitsServerResponse,
};
