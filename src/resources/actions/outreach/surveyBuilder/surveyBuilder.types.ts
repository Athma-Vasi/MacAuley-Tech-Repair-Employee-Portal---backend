import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type { SurveyBuilderDocument, SurveyQuestion, SurveyRecipient } from './surveyBuilder.model';
import type { UserRoles } from '../../../user';
import { GetQueriedResourceRequest } from '../../../../types';

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body

interface CreateNewSurveyRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    survey: {
      surveyTitle: string;
      surveyDescription: string;
      sendTo: SurveyRecipient;
      expiryDate: NativeDate;
      isAnonymous: boolean;
      questions: Array<SurveyQuestion>;
    };
  };
}

interface DeleteASurveyRequest extends RequestAfterJWTVerification {
  params: {
    surveyId: string;
  };
}

type DeleteAllSurveysRequest = RequestAfterJWTVerification;

type GetQueriedSurveysRequest = GetQueriedResourceRequest;

type GetQueriedSurveysByUserRequest = GetQueriedResourceRequest;

interface GetSurveyByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
  };
  params: { surveyId: string };
}

export type {
  CreateNewSurveyRequest,
  DeleteASurveyRequest,
  DeleteAllSurveysRequest,
  GetQueriedSurveysRequest,
  GetQueriedSurveysByUserRequest,
  GetSurveyByIdRequest,
};
