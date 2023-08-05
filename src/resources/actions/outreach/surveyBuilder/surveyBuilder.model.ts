import { Schema, Types, model } from 'mongoose';
import type { UserRoles } from '../../../user';
import type { Action } from '../../../actions';
import type { ActionsOutreach } from '../../../actions/outreach';

type SurveyRecipient =
  | 'All'
  | 'Executive Management'
  | 'Administrative'
  | 'Sales and Marketing'
  | 'Information Technology'
  | 'Repair Technicians'
  | 'Field Service Technicians'
  | 'Logistics and Inventory'
  | 'Customer Service'
  | 'Quality Control'
  | 'Training and Development'
  | 'Janitorial and Maintenance'
  | 'Security';

type SurveyResponseKind = 'chooseOne' | 'chooseAny' | 'rating';
type SurveyResponseInput = 'agreeDisagree' | 'radio' | 'checkbox' | 'emotion' | 'stars';

type AgreeDisagreeResponse =
  | 'Strongly Agree'
  | 'Agree'
  | 'Neutral'
  | 'Disagree'
  | 'Strongly Disagree';
type RadioResponse = string;
type CheckboxResponse = Array<string>;
type EmotionResponse = 'Upset' | 'Annoyed' | 'Neutral' | 'Happy' | 'Ecstatic';
type StarsResponse = 1 | 2 | 3 | 4 | 5;

type SurveyResponseDataOptions =
  | AgreeDisagreeResponse
  | RadioResponse
  | CheckboxResponse
  | EmotionResponse
  | StarsResponse;

type SurveyQuestion = {
  question: string;
  responseKind: SurveyResponseKind;
  responseInput: SurveyResponseInput;
  responseDataOptions: SurveyResponseDataOptions;
};

type SurveyBuilderSchema = {
  userId: Types.ObjectId;
  username: string;
  creatorRole: UserRoles;
  action: Action;
  category: ActionsOutreach;

  surveyTitle: string;
  surveyDescription: string;
  sendTo: SurveyRecipient;
  expiryDate: NativeDate;
  questions: Array<SurveyQuestion>;
};

type SurveyBuilderDocument = SurveyBuilderSchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const surveyBuilderSchema = new Schema<SurveyBuilderSchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'creatorID (userId) is required'],
      index: true,
    },
    username: {
      type: String,
      required: [true, 'creatorUsername is required'],
      index: true,
    },
    creatorRole: {
      type: [String],
      required: [true, 'creatorRole is required'],
    },
    action: {
      type: String,
      required: [true, 'action is required'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'category is required'],
      index: true,
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
