import Joi from "joi";
import {
  BENEFITS_PLAN_KIND_REGEX,
  CURRENCY_REGEX,
  DATE_REGEX,
  PLAN_DESCRIPTION_REGEX,
  PLAN_NAME_REGEX,
  REQUEST_STATUS_REGEX,
} from "../../../regex";

const createBenefitJoiSchema = Joi.object({
  planName: Joi.string().regex(PLAN_NAME_REGEX).required(),
  planDescription: Joi.string().regex(PLAN_DESCRIPTION_REGEX).allow(""),
  planKind: Joi.string().regex(BENEFITS_PLAN_KIND_REGEX).required(),
  planStartDate: Joi.string().regex(DATE_REGEX).required(),
  isPlanActive: Joi.boolean().required(),
  currency: Joi.string().regex(CURRENCY_REGEX).required(),
  monthlyPremium: Joi.number().required(),
  employerContribution: Joi.number().required(),
  employeeContribution: Joi.number().required(),
  requestStatus: Joi.string().regex(REQUEST_STATUS_REGEX).required(),
});

const updateBenefitJoiSchema = Joi.object({
  planName: Joi.string().regex(PLAN_NAME_REGEX),
  planDescription: Joi.string().regex(PLAN_DESCRIPTION_REGEX).allow(""),
  planKind: Joi.string().regex(BENEFITS_PLAN_KIND_REGEX),
  planStartDate: Joi.string().regex(DATE_REGEX),
  isPlanActive: Joi.boolean(),
  currency: Joi.string().regex(CURRENCY_REGEX),
  monthlyPremium: Joi.number(),
  employerContribution: Joi.number(),
  employeeContribution: Joi.number(),
  requestStatus: Joi.string().regex(REQUEST_STATUS_REGEX),
});

export { createBenefitJoiSchema, updateBenefitJoiSchema };
