import { Schema, Types, model } from 'mongoose';
import type { UserRoles } from '../../../user';
import type { Action } from '../../../actions';
import type { ActionsOutreach } from '../../../actions/outreach';

type SurveyRecipient = 'All' | 'Active' | 'Inactive' | 'Employees' | 'Admins' | 'Managers';

type SurveyResponseKind = {
  chooseOne: 'trueFalse' | 'yesNo' | 'radio';
  chooseAny: 'checkbox' | 'dropdown';
  answerKind: 'shortAnswer' | 'longAnswer';
  rating: 'scale' | 'emotion' | 'stars';
};

// The mapped type loops over each key in SurveyResponseKind and returns an object, ensuring that the value of `inputHtml` is constrained to the value of `kind` which is a key in the looped object.
type SurveyQuestion = {
  question: string;
  responseKind: {
    [Key in keyof SurveyResponseKind]: {
      kind: Key;
      inputHtml: SurveyResponseKind[Key];
      dataOptions: Array<string>;
    };
  }[keyof SurveyResponseKind];
  required: boolean;
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
  isAnonymous: boolean;
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
