import type { Types } from "mongoose";
import type { RequestAfterJWTVerification } from "../../../auth";
import type { UserRoles } from "../../../user";
import {
  DocumentUpdateOperation,
  GetQueriedResourceByUserRequest,
  GetQueriedResourceRequest,
} from "../../../../types";
import { SurveyDocument, SurveySchema } from "./survey.model";

// RequestAfterJWTVerification extends Request interface from express and adds the decoded JWT (which is the userInfo object) from verifyJWT middleware to the request body
interface CreateNewSurveyRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    surveySchema: SurveySchema;
  };
}

interface DeleteSurveyRequest extends RequestAfterJWTVerification {
  params: {
    surveyId: string;
  };
}

type DeleteAllSurveysRequest = RequestAfterJWTVerification;

type GetQueriedSurveysByUserRequest = GetQueriedResourceByUserRequest;

interface GetSurveyByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
  };
  params: { surveyId: string };
}

interface UpdateSurveyByIdRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    documentUpdate: DocumentUpdateOperation<SurveyDocument>;
  };
  params: { surveyId: string };
}

type GetQueriedSurveysRequest = GetQueriedResourceRequest;

// DEV ROUTE
interface CreateNewSurveysBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    surveySchemas: SurveySchema[];
  };
}

// DEV ROUTE
interface UpdateSurveysBulkRequest extends RequestAfterJWTVerification {
  body: {
    userInfo: {
      userId: Types.ObjectId;
      username: string;
      roles: UserRoles;
    };
    sessionId: Types.ObjectId;
    surveyFields: {
      surveyId: Types.ObjectId;
      documentUpdate: DocumentUpdateOperation<SurveyDocument>;
    }[];
  };
}

export type {
  CreateNewSurveyRequest,
  DeleteSurveyRequest,
  DeleteAllSurveysRequest,
  GetQueriedSurveysByUserRequest,
  GetSurveyByIdRequest,
  GetQueriedSurveysRequest,
  UpdateSurveyByIdRequest,
  CreateNewSurveysBulkRequest,
  UpdateSurveysBulkRequest,
};
