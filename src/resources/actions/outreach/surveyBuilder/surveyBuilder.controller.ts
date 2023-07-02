import expressAsyncHandler from 'express-async-handler';
import { Types } from 'mongoose';

import type { Response } from 'express';
import type { SurveyQuestion, SurveyRecipient, SurveyResponseKind } from './surveyBuilder.model';
import type {
  CreateNewSurveyRequest,
  DeleteASurveyRequest,
  DeleteAllSurveysRequest,
  GetAllSurveysRequest,
  GetSurveyByIdRequest,
  GetSurveysByUserRequest,
  SurveyServerResponse,
} from './surveyBuilder.types';
import { createNewSurveyService } from './surveyBuilder.service';

// @desc   Create a new survey
// @route  POST /survey-builder
// @access Private/Admin/Manager
const createNewSurveyHandler = expressAsyncHandler(
  async (request: CreateNewSurveyRequest, response: Response<SurveyServerResponse>) => {
    const {
      userInfo: { userId, username, roles },
      survey: { surveyTitle, sendTo, expiryDate, isAnonymous, questions },
    } = request.body;

    // create new survey object
    const newSurveyObject = {
      creatorId: userId,
      creatorUsername: username,
      creatorRole: roles,
      surveyTitle,
      sendTo,
      expiryDate,
      isAnonymous,
      questions,
    };

    // create new survey
    const newSurvey = await createNewSurveyService(newSurveyObject);
    if (newSurvey) {
      response.status(201).json({ message: 'New survey created', surveyData: [newSurvey] });
    } else {
      response.status(400).json({ message: 'Unable to create new survey', surveyData: [] });
    }
  }
);

export { createNewSurveyHandler };
