import Joi from "joi";
import {
  ANONYMOUS_REQUEST_KIND_REGEX,
  EMAIL_REGEX,
  GRAMMAR_TEXT_INPUT_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  REQUEST_STATUS_REGEX,
  URGENCY_REGEX,
} from "../../../regex";

const createAnonymousRequestJoiSchema = Joi.object({
  title: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX).required(),
  secureContactNumber: Joi.string().optional().default(""),
  secureContactEmail: Joi.string().regex(EMAIL_REGEX).required(),
  requestKind: Joi.string().regex(ANONYMOUS_REQUEST_KIND_REGEX).required(),
  requestDescription: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX)
    .required(),
  additionalInformation: Joi.string().optional().default(""),
  urgency: Joi.string().regex(URGENCY_REGEX).required(),
  requestStatus: Joi.string().regex(REQUEST_STATUS_REGEX).required(),
});

const updateAnonymousRequestJoiSchema = Joi.object({
  title: Joi.string().optional(),
  secureContactNumber: Joi.string().optional(),
  secureContactEmail: Joi.string().optional(),
  requestKind: Joi.string().optional(),
  requestDescription: Joi.string().optional(),
  additionalInformation: Joi.string().optional(),
  urgency: Joi.string().optional(),
  requestStatus: Joi.string().optional(),
});

export { createAnonymousRequestJoiSchema, updateAnonymousRequestJoiSchema };
