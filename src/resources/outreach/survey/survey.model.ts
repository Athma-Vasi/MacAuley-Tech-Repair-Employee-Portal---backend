import { model, Schema, Types } from "mongoose";
import type { Department, UserRoles } from "../../user";

type SurveyRecipient = Department | "All";

type SurveyResponseKind = "chooseOne" | "chooseAny" | "rating";
type SurveyResponseInput =
  | "agreeDisagree"
  | "radio"
  | "checkbox"
  | "emotion"
  | "stars";

type AgreeDisagreeResponse =
  | "Strongly Agree"
  | "Agree"
  | "Neutral"
  | "Disagree"
  | "Strongly Disagree";
type RadioResponse = string;
type CheckboxResponse = Array<string>;
type EmotionResponse = "Upset" | "Annoyed" | "Neutral" | "Happy" | "Ecstatic";
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
  responseDataOptions: string[] | string | number;
};

type SurveyStatistics = {
  question: string;
  totalResponses: number;
  responseInput: SurveyResponseInput;
  responseDistribution: Record<string, number>;
};

type SurveySchema = {
  userId: Types.ObjectId;
  username: string;
  creatorRole: UserRoles;
  surveyTitle: string;
  surveyDescription: string;
  sendTo: SurveyRecipient;
  expiryDate: NativeDate;
  questions: Array<SurveyQuestion>;
  surveyStatistics: SurveyStatistics[];
};

type SurveyDocument = SurveySchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const surveySchema = new Schema<SurveySchema>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "creatorID (userId) is required"],
      index: true,
    },
    username: {
      type: String,
      required: [true, "creatorUsername is required"],
    },
    creatorRole: {
      type: [String],
      required: [true, "creatorRole is required"],
      index: true,
    },
    surveyTitle: {
      type: String,
      required: [true, "surveyTitle is required"],
    },
    sendTo: {
      type: String,
      required: [true, "sendTo is required"],
      index: true,
    },
    expiryDate: {
      type: Date,
      required: [true, "expiryDate is required"],
    },
    questions: {
      type: [Object],
      required: [true, "questions is required"],
    },

    surveyStatistics: {
      type: [Object],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// text index for searching
surveySchema.index({
  username: "text",
  surveyTitle: "text",
  sendTo: "text",
  expiryDate: "text",
  questions: "text",
});

const SurveyModel = model<SurveyDocument>("SurveyBuilder", surveySchema);

export { SurveyModel };
export type {
  SurveyDocument,
  SurveyQuestion,
  SurveyRecipient,
  SurveyResponseDataOptions,
  SurveyResponseInput,
  SurveyResponseKind,
  SurveySchema,
  SurveyStatistics,
};
