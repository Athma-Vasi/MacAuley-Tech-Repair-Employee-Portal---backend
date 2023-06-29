import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../auth';
import type { UserRoles } from '../../../user';
import type { RefermentDocument } from './referment.model';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface CreateNewRefermentRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId; // referrer userId
      username: string; // referrer username
      roles: UserRoles;
    };
    candidateFullName: string;
    candidateEmail: string;
    candidateContactNumber: string;
    candidateCurrentJobTitle: string;
    candidateCurrentCompany: string;
    candidateLinkedinProfile: string;

    positionReferredFor: string;
    positionJobDescription: string;
    referralReason: string;
    additionalInformation: string;
    privacyConsent: boolean;
  };
}

interface DeleteARefermentRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: {
    refermentId: Types.ObjectId;
  };
}

type DeleteAllRefermentsRequest = RequestAfterJWTVerification;

type GetAllRefermentsRequest = RequestAfterJWTVerification;

type GetRefermentsByUserRequest = RequestAfterJWTVerification;

interface GetARefermentRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    refermentId: Types.ObjectId;
  };
}

interface UpdateARefermentRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    candidateFullName: string;
    candidateEmail: string;
    candidateContactNumber: string;
    candidateCurrentJobTitle: string;
    candidateCurrentCompany: string;
    candidateLinkedinProfile: string;

    positionReferredFor: string;
    positionJobDescription: string;
    referralReason: string;
    additionalInformation: string;
    privacyConsent: boolean;
  };
  params: {
    refermentId: Types.ObjectId;
  };
}

type RefermentsServerResponse = {
  message: string;
  refermentData: Array<RefermentDocument>;
};

export type {
  CreateNewRefermentRequest,
  DeleteARefermentRequest,
  DeleteAllRefermentsRequest,
  GetAllRefermentsRequest,
  GetRefermentsByUserRequest,
  GetARefermentRequest,
  UpdateARefermentRequest,
  RefermentsServerResponse,
};
