import { Types } from 'mongoose';

import type { DeleteResult } from 'mongodb';
import type { SurveyBuilderDocument, SurveyBuilderSchema, SurveyStatistics } from './survey.model';
import type {
  DatabaseResponse,
  DatabaseResponseNullable,
  QueriedResourceGetRequestServiceInput,
  QueriedTotalResourceGetRequestServiceInput,
} from '../../../../types';

import { SurveyBuilderModel } from './survey.model';

async function createNewSurveyService(
  surveyObj: SurveyBuilderSchema
): Promise<SurveyBuilderDocument> {
  try {
    const newSurvey = await SurveyBuilderModel.create(surveyObj);
    return newSurvey;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewSurveyService' });
  }
}

async function getQueriedSurveysService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<SurveyBuilderDocument>): DatabaseResponse<SurveyBuilderDocument> {
  try {
    const surveys = await SurveyBuilderModel.find(filter, projection, options).lean().exec();
    return surveys;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedSurveysService' });
  }
}

async function getQueriedTotalSurveysService({
  filter = {},
}: QueriedTotalResourceGetRequestServiceInput<SurveyBuilderDocument>): Promise<number> {
  try {
    const totalSurveys = await SurveyBuilderModel.countDocuments(filter).lean().exec();
    return totalSurveys;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedTotalSurveysService' });
  }
}

async function getQueriedSurveysByUserService({
  filter = {},
  projection = null,
  options = {},
}: QueriedResourceGetRequestServiceInput<SurveyBuilderDocument>): DatabaseResponse<SurveyBuilderDocument> {
  try {
    const surveys = await SurveyBuilderModel.find(filter, projection, options).lean().exec();
    return surveys;
  } catch (error: any) {
    throw new Error(error, { cause: 'getQueriedSurveysByUserService' });
  }
}

async function getSurveyByIdService(
  surveyId: string | Types.ObjectId
): DatabaseResponseNullable<SurveyBuilderDocument> {
  try {
    const survey = await SurveyBuilderModel.findById(surveyId).select('-__v').lean().exec();
    return survey;
  } catch (error: any) {
    throw new Error(error, { cause: 'getSurveyByIdService' });
  }
}

async function updateSurveyByIdService({
  surveyId,
  surveyField,
}: {
  surveyId: string | Types.ObjectId;
  surveyField: Partial<SurveyBuilderSchema>;
}): DatabaseResponseNullable<SurveyBuilderDocument> {
  try {
    const survey = await SurveyBuilderModel.findByIdAndUpdate(
      surveyId,
      { ...surveyField },
      { new: true }
    )
      .select(['-__v', '-action', '-category'])
      .lean()
      .exec();
    return survey;
  } catch (error: any) {
    throw new Error(error, { cause: 'updateSurveyByIdService' });
  }
}

async function deleteASurveyService(surveyId: string): Promise<DeleteResult> {
  try {
    const deleteResult = await SurveyBuilderModel.deleteOne({ _id: surveyId }).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteASurveyService' });
  }
}

async function deleteAllSurveysService(): Promise<DeleteResult> {
  try {
    const deleteResult = await SurveyBuilderModel.deleteMany({}).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteAllSurveysService' });
  }
}

export {
  createNewSurveyService,
  getSurveyByIdService,
  deleteASurveyService,
  deleteAllSurveysService,
  getQueriedSurveysService,
  getQueriedSurveysByUserService,
  getQueriedTotalSurveysService,
  updateSurveyByIdService,
};
