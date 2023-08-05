import expressAsyncHandler from 'express-async-handler';

import type { DeleteResult } from 'mongodb';
import type { Response } from 'express';
import type { SurveyBuilderDocument, SurveyBuilderSchema } from './surveyBuilder.model';
import type {
  CreateNewSurveyRequest,
  DeleteASurveyRequest,
  DeleteAllSurveysRequest,
  GetQueriedSurveysRequest,
  GetSurveyByIdRequest,
  GetQueriedSurveysByUserRequest,
} from './surveyBuilder.types';
import {
  createNewSurveyService,
  deleteASurveyService,
  deleteAllSurveysService,
  getQueriedSurveysService,
  getSurveyByIdService,
  getQueriedSurveysByUserService,
  getQueriedTotalSurveysService,
} from './surveyBuilder.service';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import { FilterQuery, QueryOptions } from 'mongoose';

// @desc   Create a new survey
// @route  POST /survey-builder
// @access Private/Admin/Manager
const createNewSurveyHandler = expressAsyncHandler(
  async (
    request: CreateNewSurveyRequest,
    response: Response<ResourceRequestServerResponse<SurveyBuilderDocument>>
  ) => {
    const {
      userInfo: { userId, username, roles },
      survey: { surveyTitle, surveyDescription, sendTo, expiryDate, questions },
    } = request.body;

    // create new survey object
    const newSurveyObject: SurveyBuilderSchema = {
      userId,
      username,
      creatorRole: roles,
      action: 'outreach',
      category: 'survey builder',

      surveyTitle,
      surveyDescription,
      sendTo,
      expiryDate,
      questions,
    };

    // create new survey
    const newSurvey = await createNewSurveyService(newSurveyObject);
    if (!newSurvey) {
      response.status(400).json({ message: 'Unable to create new survey', resourceData: [] });
      return;
    }

    response
      .status(201)
      .json({ message: 'Successfully created new survey!', resourceData: [newSurvey] });
  }
);

// @desc   Get all surveys
// @route  GET /survey-builder
// @access Private/Admin/Manager
const getQueriedSurveysHandler = expressAsyncHandler(
  async (
    request: GetQueriedSurveysRequest,
    response: Response<GetQueriedResourceRequestServerResponse<SurveyBuilderDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalSurveysService({
        filter: filter as FilterQuery<SurveyBuilderDocument> | undefined,
      });
    }

    // get all surveys
    const surveys = await getQueriedSurveysService({
      filter: filter as FilterQuery<SurveyBuilderDocument> | undefined,
      projection: projection as QueryOptions<SurveyBuilderDocument>,
      options: options as QueryOptions<SurveyBuilderDocument>,
    });
    if (surveys.length === 0) {
      response.status(404).json({
        message: 'No surveys that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found surveys',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: surveys,
      });
    }
  }
);

// @desc   Get surveys by user
// @route  GET /survey-builder/user
// @access Private/Admin/Manager
const getQueriedSurveysByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedSurveysByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<SurveyBuilderDocument>>
  ) => {
    const {
      userInfo: { userId },
    } = request.body;
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // assign userId to filter
    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalSurveysService({
        filter: filterWithUserId,
      });
    }

    const surveys = await getQueriedSurveysByUserService({
      filter: filterWithUserId as FilterQuery<SurveyBuilderDocument> | undefined,
      projection: projection as QueryOptions<SurveyBuilderDocument>,
      options: options as QueryOptions<SurveyBuilderDocument>,
    });
    if (surveys.length === 0) {
      response.status(404).json({
        message: 'No surveys found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Surveys found successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: surveys,
      });
    }
  }
);

// @desc   Get a survey by id
// @route  GET /survey-builder/:surveyId
// @access Private/Admin/Manager
const getSurveyByIdHandler = expressAsyncHandler(
  async (
    request: GetSurveyByIdRequest,
    response: Response<ResourceRequestServerResponse<SurveyBuilderDocument>>
  ) => {
    const surveyId = request.params.surveyId;

    // get survey by id
    const survey = await getSurveyByIdService(surveyId);
    if (survey) {
      response.status(200).json({ message: 'Survey retrieved', resourceData: [survey] });
    } else {
      response.status(400).json({ message: 'Unable to retrieve survey', resourceData: [] });
    }
  }
);

// @desc   Delete a survey by id
// @route  DELETE /survey-builder/:surveyId
// @access Private/Admin/Manager
const deleteASurveyHandler = expressAsyncHandler(
  async (
    request: DeleteASurveyRequest,
    response: Response<ResourceRequestServerResponse<SurveyBuilderDocument>>
  ) => {
    const surveyId = request.params.surveyId;

    // check that survey exists
    const surveyToDelete = await getSurveyByIdService(surveyId);
    if (!surveyToDelete) {
      response.status(404).json({ message: 'Survey not found', resourceData: [] });
      return;
    }

    // check that now is after the expiry date
    const now = new Date().getTime();
    const expiryDate = new Date(surveyToDelete.expiryDate).getTime();
    if (now < expiryDate) {
      response.status(400).json({ message: 'Survey is not expired yet', resourceData: [] });
      return;
    }

    // delete survey
    const deleteResult: DeleteResult = await deleteASurveyService(surveyId);
    if (deleteResult.deletedCount === 1) {
      response.status(200).json({ message: 'Survey deleted', resourceData: [] });
    } else {
      response.status(400).json({ message: 'Unable to delete survey', resourceData: [] });
    }
  }
);

// @desc   Delete all surveys
// @route  DELETE /survey-builder
// @access Private/Admin/Manager
const deleteAllSurveysHandler = expressAsyncHandler(
  async (
    _request: DeleteAllSurveysRequest,
    response: Response<ResourceRequestServerResponse<SurveyBuilderDocument>>
  ) => {
    // delete all surveys
    const deleteResult: DeleteResult = await deleteAllSurveysService();
    if (deleteResult.deletedCount > 0) {
      response.status(200).json({ message: 'All surveys deleted', resourceData: [] });
    } else {
      response.status(400).json({ message: 'Unable to delete surveys', resourceData: [] });
    }
  }
);

export {
  createNewSurveyHandler,
  deleteASurveyHandler,
  deleteAllSurveysHandler,
  getQueriedSurveysHandler,
  getSurveyByIdHandler,
  getQueriedSurveysByUserHandler,
};
