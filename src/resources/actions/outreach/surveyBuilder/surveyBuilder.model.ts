import { Schema, Types, model } from 'mongoose';
import { UserRoles } from '../../../user';

type SurveyRecipient = 'all' | 'active' | 'inactive' | 'employees' | 'admins' | 'managers';

type SurveyResponseKind = {
  chooseOne: 'trueFalse' | 'yesNo';
  chooseAny: 'checkbox' | 'dropdown';
  shortAnswer: 'shortAnswer';
  rating: 'scale' | 'emotion';
};

type SurveyQuestion = {
  question: string;
  responseKind: SurveyResponseKind;
  required: boolean;
};

type SurveyBuilderSchema = {
  creatorId: Types.ObjectId;
  creatorUsername: string;
  creatorRole: UserRoles;
  surveyTitle: string;
  sendTo: SurveyRecipient;
  expiryDate: NativeDate;
  isAnonymous: boolean;
  questions: Array<SurveyQuestion>;
};

type SurveyBuilderDocument = SurveyBuilderSchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const surveyBuilderSchema = new Schema<SurveyBuilderDocument>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      required: [true, 'creatorID (userId) is required'],
      index: true,
    },
    creatorUsername: {
      type: String,
      required: [true, 'creatorUsername is required'],
      index: true,
    },
    creatorRole: {
      type: [String],
      required: [true, 'creatorRole is required'],
    },
    surveyTitle: {
      type: String,
      required: [true, 'surveyTitle is required'],
    },
    sendTo: {
      type: String,
      required: [true, 'sendTo is required'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'expiryDate is required'],
    },
    isAnonymous: {
      type: Boolean,
      required: [true, 'isAnonymous is required'],
    },
    questions: {
      type: [Array],
      required: [true, 'questions is required'],
    },
  },
  {
    timestamps: true,
  }
);

const SurveyBuilderModel = model<SurveyBuilderDocument>('SurveyBuilder', surveyBuilderSchema);

export { SurveyBuilderModel };
export type {
  SurveyBuilderSchema,
  SurveyBuilderDocument,
  SurveyRecipient,
  SurveyResponseKind,
  SurveyQuestion,
};
