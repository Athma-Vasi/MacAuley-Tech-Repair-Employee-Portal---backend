import expressAsyncHandler from 'express-async-handler';

import type { DeleteResult } from 'mongodb';
import type { Response } from 'express';
import type { SurveyBuilderDocument, SurveyBuilderSchema, SurveyStatistics } from './survey.model';
import type {
  CreateNewSurveyRequest,
  DeleteASurveyRequest,
  DeleteAllSurveysRequest,
  GetQueriedSurveysRequest,
  GetSurveyByIdRequest,
  GetQueriedSurveysByUserRequest,
  UpdateSurveyStatisticsByIdRequest,
  CreateNewSurveysBulkRequest,
} from './survey.types';
import {
  createNewSurveyService,
  deleteASurveyService,
  deleteAllSurveysService,
  getQueriedSurveysService,
  getSurveyByIdService,
  getQueriedSurveysByUserService,
  getQueriedTotalSurveysService,
  updateSurveyByIdService,
} from './survey.service';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';
import { FilterQuery, QueryOptions, Types } from 'mongoose';
import { UserDocument, getUserByIdService, updateUserByIdService } from '../../../user';

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
      survey: { surveyTitle, surveyDescription, sendTo, expiryDate, questions, surveyStatistics },
    } = request.body;

    // create new survey object
    const newSurveyObject: SurveyBuilderSchema = {
      userId,
      username,
      creatorRole: roles,
      action: 'outreach',
      category: 'survey',

      surveyTitle,
      surveyDescription,
      sendTo,
      expiryDate,
      questions,

      surveyStatistics,
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

// DEV ROUTE
// @desc   Create new surveys in bulk
// @route  POST /survey-builder/dev
// @access Private/Admin/Manager
const createNewSurveysBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewSurveysBulkRequest,
    response: Response<ResourceRequestServerResponse<SurveyBuilderDocument>>
  ) => {
    const { surveys } = request.body;

    // create new surveys
    const newSurveys = await Promise.all(
      surveys.map(async (survey) => {
        const {
          userId,
          username,
          creatorRole,
          surveyTitle,
          surveyDescription,
          sendTo,
          expiryDate,
          questions,
          surveyStatistics,
        } = survey;

        // create new survey object
        const newSurveyObject: SurveyBuilderSchema = {
          userId,
          username,
          creatorRole,
          action: 'outreach',
          category: 'survey',

          surveyTitle,
          surveyDescription,
          sendTo,
          expiryDate,
          questions,

          surveyStatistics,
        };

        // create new survey
        const newSurvey = await createNewSurveyService(newSurveyObject);

        return newSurvey;
      })
    );

    // filter out undefined values
    const newSurveysFiltered = newSurveys.filter(
      (survey) => survey !== undefined
    ) as SurveyBuilderDocument[];

    // check if any surveys were created
    if (newSurveysFiltered.length === surveys.length) {
      response
        .status(201)
        .json({ message: 'Successfully created new surveys!', resourceData: newSurveysFiltered });
    } else {
      response.status(400).json({ message: 'Unable to create new surveys', resourceData: [] });
    }
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

// @desc   Update survey statistics by id
// @route  PATCH /survey-builder/:surveyId
// @access Private/Admin/Manager
const updateSurveyStatisticsByIdHandler = expressAsyncHandler(
  async (
    request: UpdateSurveyStatisticsByIdRequest,
    response: Response<ResourceRequestServerResponse<SurveyBuilderDocument | UserDocument>>
  ) => {
    const { surveyId } = request.params;
    const {
      surveyResponses,
      userInfo: { userId },
    } = request.body;

    console.log({ surveyResponses, userId, surveyId });

    // check that survey exists
    const surveyToUpdate = await getSurveyByIdService(surveyId);
    if (!surveyToUpdate) {
      response.status(404).json({ message: 'Survey not found', resourceData: [] });
      return;
    }

    // grab survey statistics
    const surveyStatistics = surveyToUpdate.surveyStatistics as SurveyStatistics[];

    // update survey statistics
    const updatedSurveyStatistics = surveyResponses.reduce(
      (surveyStatisticsAcc, { question, response, inputKind }) => {
        // find question in survey statistics
        const statisticsIdx = surveyStatisticsAcc.findIndex(
          (surveyStatistic) => surveyStatistic.question === question
        );

        // if question is found, update the question's responses
        if (statisticsIdx !== -1) {
          const surveyStatisticObj = surveyStatisticsAcc[statisticsIdx];

          // update total responses
          surveyStatisticObj.totalResponses += 1;

          // update the response distribution
          Object.entries(surveyStatisticObj.responseDistribution).forEach(
            ([responseOption, _responseValue]) => {
              // if response is an array of strings
              if (Array.isArray(response)) {
                // loop through response array
                response.forEach((responseValue) => {
                  // if responseOption is in response, increment responseDistribution
                  if (responseOption === responseValue) {
                    surveyStatisticObj.responseDistribution[responseOption] += 1;
                  }
                });

                // if response is a string
              } else if (typeof response === 'string') {
                if (responseOption === response) {
                  surveyStatisticObj.responseDistribution[responseOption] += 1;
                }
              }
              // if response is a number
              else if (typeof response === 'number') {
                if (responseOption === response.toString()) {
                  surveyStatisticObj.responseDistribution[responseOption] += 1;
                }
              }
            }
          );

          // add the surveyStatisticObj back to the surveyStatisticsAcc
          surveyStatisticsAcc[statisticsIdx] = surveyStatisticObj;
        }

        return surveyStatisticsAcc;
      },
      surveyStatistics
    );

    // update survey
    const updatedSurvey = await updateSurveyByIdService({
      surveyId,
      surveyField: { surveyStatistics: updatedSurveyStatistics },
    });
    if (!updatedSurvey) {
      response.status(400).json({ message: 'Unable to update survey', resourceData: [] });
      return;
    }

    // fetch user
    const user = await getUserByIdService(userId);
    if (!user) {
      response.status(404).json({ message: 'User not found', resourceData: [] });
      return;
    }

    const { completedSurveys } = user;
    const updatedCompletedSurveys = Array.from(new Set([...completedSurveys, surveyId]));

    console.group('updateSurveyStatisticsByIdHandler');
    console.log({
      surveyId,
      updatedSurveyStatistics,
      completedSurveys,
      updatedCompletedSurveys,
    });
    console.groupEnd();

    // update completedSurveys field with surveyId
    const updatedUser = await updateUserByIdService({
      userId: user._id,
      userFields: { completedSurveys: updatedCompletedSurveys },
    });
    if (!updatedUser) {
      response.status(400).json({ message: 'Unable to update user', resourceData: [] });
      return;
    }

    response
      .status(200)
      .json({ message: 'Survey updated', resourceData: [updatedSurvey, updatedUser] });
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
  createNewSurveysBulkHandler,
  deleteASurveyHandler,
  deleteAllSurveysHandler,
  getQueriedSurveysHandler,
  getSurveyByIdHandler,
  getQueriedSurveysByUserHandler,
  updateSurveyStatisticsByIdHandler,
};
