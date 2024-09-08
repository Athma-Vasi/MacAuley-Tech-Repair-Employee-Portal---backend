import Joi from "joi";
import {
  DEPARTMENT_REGEX,
  FULL_NAME_REGEX,
  GRAMMAR_TEXT_INPUT_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  JOB_POSITION_REGEX,
  PHONE_NUMBER_REGEX,
  URL_REGEX,
} from "../../../regex";

const createRefermentJoiSchema = Joi.object({
  candidateFullName: Joi.string().regex(FULL_NAME_REGEX).required(),
  candidateEmail: Joi.string().email().required(),
  candidateContactNumber: Joi.string().regex(PHONE_NUMBER_REGEX).required(),
  candidateCurrentJobTitle: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX)
    .required(),
  candidateCurrentCompany: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX)
    .required(),
  candidateProfileUrl: Joi.string().regex(URL_REGEX).required(),
  departmentReferredFor: Joi.string().regex(DEPARTMENT_REGEX).required(),
  positionReferredFor: Joi.string().regex(JOB_POSITION_REGEX).required(),
  positionJobDescription: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX)
    .required(),
  referralReason: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),
  additionalInformation: Joi.string().optional().allow(""),
  privacyConsent: Joi.boolean().required(),
});

const updateRefermentJoiSchema = Joi.object({
  candidateFullName: Joi.string(),
  candidateEmail: Joi.string().email(),
  candidateContactNumber: Joi.string(),
  candidateCurrentJobTitle: Joi.string(),
  candidateCurrentCompany: Joi.string(),
  candidateProfileUrl: Joi.string(),
  departmentReferredFor: Joi.string(),
  positionReferredFor: Joi.string(),
  positionJobDescription: Joi.string(),
  referralReason: Joi.string(),
  additionalInformation: Joi.string(),
  privacyConsent: Joi.boolean(),
});

export { createRefermentJoiSchema, updateRefermentJoiSchema };
