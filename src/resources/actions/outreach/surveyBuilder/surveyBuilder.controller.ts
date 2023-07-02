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
import {
  createNewSurveyService,
  deleteASurveyService,
  deleteAllSurveysService,
  getSurveyByIdService,
} from './surveyBuilder.service';

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

// @desc   Delete a survey by id
// @route  DELETE /survey-builder/:surveyId
// @access Private/Admin/Manager
const deleteASurveyHandler = expressAsyncHandler(
  async (request: DeleteASurveyRequest, response: Response<SurveyServerResponse>) => {
    const surveyId = request.params.surveyId as Types.ObjectId;

    // check that survey exists
    const surveyToDelete = await getSurveyByIdService(surveyId);
    if (!surveyToDelete) {
      response.status(404).json({ message: 'Survey not found', surveyData: [] });
      return;
    }

    // check that now is after the expiry date
    const now = new Date();
    if (now < surveyToDelete.expiryDate) {
      response.status(400).json({ message: 'Survey is not expired yet', surveyData: [] });
    }

    // delete survey
    const deleteResult = await deleteASurveyService(surveyId);
    if (deleteResult.deletedCount === 1) {
      response.status(200).json({ message: 'Survey deleted', surveyData: [] });
    } else {
      response.status(400).json({ message: 'Unable to delete survey', surveyData: [] });
    }
  }
);

// @desc   Delete all surveys
// @route  DELETE /survey-builder
// @access Private/Admin/Manager
const deleteAllSurveysHandler = expressAsyncHandler(
  async (request: DeleteAllSurveysRequest, response: Response<SurveyServerResponse>) => {
    // delete all surveys
    const deleteResult = await deleteAllSurveysService();
    if (deleteResult.deletedCount > 0) {
      response.status(200).json({ message: 'All surveys deleted', surveyData: [] });
    } else {
      response.status(400).json({ message: 'Unable to delete surveys', surveyData: [] });
    }
  }
);

export { createNewSurveyHandler, deleteASurveyHandler, deleteAllSurveysHandler };
