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

export { createNewSurveyService };
