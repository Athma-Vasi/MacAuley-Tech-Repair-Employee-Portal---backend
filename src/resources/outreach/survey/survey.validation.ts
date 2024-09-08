import Joi from "joi";
import {
  GRAMMAR_TEXT_INPUT_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  SURVEY_RECIPIENT_REGEX,
  SURVEY_RESPONSE_INPUT_REGEX,
  SURVEY_RESPONSE_KIND_REGEX,
  USER_ROLES_REGEX,
} from "../../../regex";

const createSurveyJoiSchema = Joi.object({
  creatorRole: Joi.string().regex(USER_ROLES_REGEX).required(),
  surveyTitle: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX).required(),
  surveyDescription: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX)
    .required(),
  sendTo: Joi.string().regex(SURVEY_RECIPIENT_REGEX).required(),
  expiryDate: Joi.date().required(),
  questions: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX).required(),
        responseKind: Joi.string().regex(SURVEY_RESPONSE_KIND_REGEX).required(),
        responseInput: Joi.string().regex(SURVEY_RESPONSE_INPUT_REGEX)
          .required(),
        responseDataOptions: Joi.alternatives()
          .try(Joi.array().items(Joi.string()), Joi.string(), Joi.number())
          .required(),
      }),
    )
    .required(),
  surveyStatistics: Joi.array()
    .items(
      Joi.object({
        question: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX).required(),
        totalResponses: Joi.number().required(),
        responseInput: Joi.string().regex(SURVEY_RESPONSE_INPUT_REGEX)
          .required(),
        responseDistribution: Joi.object().required(),
      }),
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
    }),
  ),
  surveyStatistics: Joi.array().items(
    Joi.object({
      question: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX),
      totalResponses: Joi.number(),
      responseInput: Joi.string().regex(SURVEY_RESPONSE_INPUT_REGEX),
      responseDistribution: Joi.object(),
    }),
  ),
});

export { createSurveyJoiSchema, updateSurveyJoiSchema };
