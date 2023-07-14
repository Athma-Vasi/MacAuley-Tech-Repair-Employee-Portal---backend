import { Types } from 'mongoose';

import type { DeleteResult } from 'mongodb';
import type { SurveyBuilderDocument, SurveyBuilderSchema } from './surveyBuilder.model';
import type { DatabaseResponse, DatabaseResponseNullable } from '../../../../types';

import { SurveyBuilderModel } from './surveyBuilder.model';

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

async function getSurveyByIdService(
  surveyId: string | Types.ObjectId
): DatabaseResponseNullable<SurveyBuilderDocument> {
  try {
    const survey = await SurveyBuilderModel.findById(surveyId).lean().exec();
    return survey;
  } catch (error: any) {
    throw new Error(error, { cause: 'getSurveyByIdService' });
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

async function getAllSurveysService(): DatabaseResponse<SurveyBuilderDocument> {
  try {
    const surveys = await SurveyBuilderModel.find({}).lean().exec();
    return surveys;
  } catch (error: any) {
    throw new Error(error, { cause: 'getAllSurveysService' });
  }
}

async function getSurveysByUserService(
  userId: Types.ObjectId | string
): DatabaseResponse<SurveyBuilderDocument> {
  try {
    const surveys = await SurveyBuilderModel.find({ creatorId: userId }).lean().exec();
    return surveys;
  } catch (error: any) {
    throw new Error(error, { cause: 'getSurveysByUserService' });
  }
}

export {
  createNewSurveyService,
  getSurveyByIdService,
  deleteASurveyService,
  deleteAllSurveysService,
  getAllSurveysService,
  getSurveysByUserService,
};
