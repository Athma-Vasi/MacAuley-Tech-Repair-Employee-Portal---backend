import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { UserRoles, JobPosition, PhoneNumber } from '../../../user';
import { GetQueriedResourceRequest, RequestStatus } from '../../../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface CreateNewRefermentRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId; // referrer userId
      username: string; // referrer username
      roles: UserRoles;
    };
    referment: {
      candidateFullName: string;
      candidateEmail: string;
      candidateContactNumber: PhoneNumber;
      candidateCurrentJobTitle: string;
      candidateCurrentCompany: string;
      candidateProfileUrl: string;

      positionReferredFor: JobPosition;
      positionJobDescription: string;
      referralReason: string;
      additionalInformation: string;
      privacyConsent: boolean;
      requestStatus: RequestStatus;
    };
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
    refermentId: string;
  };
}

type DeleteAllRefermentsRequest = RequestAfterJWTVerification;

type GetQueriedRefermentsRequest = GetQueriedResourceRequest;

type GetQueriedRefermentsByUserRequest = GetQueriedResourceRequest;

interface GetRefermentRequestById extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    params: { refermentId: string };
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
    candidateContactNumber: PhoneNumber;
    candidateCurrentJobTitle: string;
    candidateCurrentCompany: string;
    candidateProfileUrl: string;

    positionReferredFor: JobPosition;
    positionJobDescription: string;
    referralReason: string;
    additionalInformation: string;
    privacyConsent: boolean;
    requestStatus: RequestStatus;
  };
  params: {
    refermentId: string;
  };
}

export type {
  CreateNewRefermentRequest,
  DeleteARefermentRequest,
  DeleteAllRefermentsRequest,
  GetQueriedRefermentsRequest,
  GetQueriedRefermentsByUserRequest,
  GetRefermentRequestById,
  UpdateARefermentRequest,
};
