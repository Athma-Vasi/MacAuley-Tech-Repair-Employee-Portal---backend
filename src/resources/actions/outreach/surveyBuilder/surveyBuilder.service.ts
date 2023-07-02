import { Types } from 'mongoose';

import type { DeleteResult } from 'mongodb';
import type {
  SurveyBuilderDocument,
  SurveyBuilderSchema,
  SurveyQuestion,
  SurveyRecipient,
  SurveyResponseKind,
} from './surveyBuilder.model';
import type { UserRoles } from '../../../user';

import { SurveyBuilderModel } from './surveyBuilder.model';
import { DatabaseResponseNullable } from '../../../../types';

type CreateNewSurveyServiceInput = {
  creatorId: Types.ObjectId;
  creatorUsername: string;
  creatorRole: UserRoles;
  surveyTitle: string;
  sendTo: SurveyRecipient;
  expiryDate: Date;
  isAnonymous: boolean;
  questions: Array<SurveyQuestion>;
};

async function createNewSurveyService(
  surveyObj: CreateNewSurveyServiceInput
): Promise<SurveyBuilderDocument> {
  try {
    const newSurvey = await SurveyBuilderModel.create(surveyObj);
    return newSurvey;
  } catch (error: any) {
    throw new Error(error, { cause: 'createNewSurveyService' });
  }
}

async function getSurveyByIdService(
  surveyId: Types.ObjectId
): DatabaseResponseNullable<SurveyBuilderDocument> {
  try {
    const survey = await SurveyBuilderModel.findById(surveyId).lean().exec();
    return survey;
  } catch (error: any) {
    throw new Error(error, { cause: 'getSurveyByIdService' });
  }
}

async function deleteASurveyService(surveyId: Types.ObjectId) {
  try {
    const deleteResult = await SurveyBuilderModel.deleteOne({ _id: surveyId }).lean().exec();
    return deleteResult;
  } catch (error: any) {
    throw new Error(error, { cause: 'deleteASurveyService' });
  }
}

async function deleteAllSurveysService() {
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
};
