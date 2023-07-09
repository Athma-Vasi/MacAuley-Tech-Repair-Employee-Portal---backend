import type { Request } from 'express';
import type { Types } from 'mongoose';
import type { RequestAfterJWTVerification } from '../../../auth';
import type {
  SurveyBuilderDocument,
  SurveyQuestion,
  SurveyRecipient,
  SurveyResponseKind,
} from './surveyBuilder.model';
import type { UserRoles } from '../../../user';

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

type GetAllSurveysRequest = RequestAfterJWTVerification;

type GetSurveysByUserRequest = RequestAfterJWTVerification;

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

type SurveyServerResponse = {
  message: string;
  surveyData: Array<SurveyBuilderDocument>;
};

export type {
  CreateNewSurveyRequest,
  DeleteASurveyRequest,
  DeleteAllSurveysRequest,
  GetAllSurveysRequest,
  GetSurveysByUserRequest,
  GetSurveyByIdRequest,
  SurveyServerResponse,
};
