/**
 * type SurveySchema = {
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

type SurveyRecipient = Department | "All";

type SurveyResponseKind = "chooseOne" | "chooseAny" | "rating";
type SurveyResponseInput = "agreeDisagree" | "radio" | "checkbox" | "emotion" | "stars";

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
 */

import Joi from "joi";
import {
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  GRAMMAR_TEXT_INPUT_REGEX,
  SURVEY_RECIPIENT_REGEX,
  SURVEY_RESPONSE_INPUT_REGEX,
  SURVEY_RESPONSE_KIND_REGEX,
  USER_ROLES_REGEX,
} from "../../../../regex";

const createSurveyJoiSchema = Joi.object({
  creatorRole: Joi.string().regex(USER_ROLES_REGEX).required(),
  surveyTitle: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX).required(),
  surveyDescription: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),
  sendTo: Joi.string().regex(SURVEY_RECIPIENT_REGEX).required(),
  expiryDate: Joi.date().required(),
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX).required(),
        responseKind: Joi.string().regex(SURVEY_RESPONSE_KIND_REGEX).required(),
        responseInput: Joi.string().regex(SURVEY_RESPONSE_INPUT_REGEX).required(),
        responseDataOptions: Joi.alternatives()
          .try(Joi.array().items(Joi.string()), Joi.string(), Joi.number())
          .required(),
      })
    )
    .required(),
  surveyStatistics: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX).required(),
        totalResponses: Joi.number().required(),
        responseInput: Joi.string().regex(SURVEY_RESPONSE_INPUT_REGEX).required(),
        responseDistribution: Joi.object().required(),
      })
    )
    .required(),
});

const updateSurveyJoiSchema = Joi.object({
  creatorRole: Joi.string().regex(USER_ROLES_REGEX),
  surveyTitle: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX),
  surveyDescription: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX),
  sendTo: Joi.string().regex(SURVEY_RECIPIENT_REGEX),
  expiryDate: Joi.date(),
  questions: Joi.array().items(
    Joi.object({
      question: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX),
      responseKind: Joi.string().regex(SURVEY_RESPONSE_KIND_REGEX),
      responseInput: Joi.string().regex(SURVEY_RESPONSE_INPUT_REGEX),
      responseDataOptions: Joi.alternatives()
        .try(Joi.array().items(Joi.string()), Joi.string(), Joi.number())
        .required(),
    })
  ),
  surveyStatistics: Joi.array().items(
    Joi.object({
      question: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX),
      totalResponses: Joi.number(),
      responseInput: Joi.string().regex(SURVEY_RESPONSE_INPUT_REGEX),
      responseDistribution: Joi.object(),
    })
  ),
});

export { createSurveyJoiSchema, updateSurveyJoiSchema };
