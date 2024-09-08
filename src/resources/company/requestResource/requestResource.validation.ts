import Joi from "joi";
import {
  DEPARTMENT_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  REQUEST_RESOURCE_KIND_REGEX,
  URGENCY_REGEX,
} from "../../../regex";

const createRequestResourceJoiSchema = Joi.object({
  department: Joi.string().regex(DEPARTMENT_REGEX).required(),
  resourceType: Joi.string().regex(REQUEST_RESOURCE_KIND_REGEX).required(),
  resourceQuantity: Joi.number().required(),
  resourceDescription: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX)
    .required(),
  reasonForRequest: Joi.string().optional().default(""),
  urgency: Joi.string().regex(URGENCY_REGEX).required(),
  dateNeededBy: Joi.date().required(),
  additionalInformation: Joi.string().optional().default(""),
});

const updateRequestResourceJoiSchema = Joi.object({
  department: Joi.string().optional(),
  resourceType: Joi.string().optional(),
  resourceQuantity: Joi.number().optional(),
  resourceDescription: Joi.string().optional(),
  reasonForRequest: Joi.string().optional(),
  urgency: Joi.string().optional(),
  dateNeededBy: Joi.date().optional(),
  additionalInformation: Joi.string().optional(),
});

export { createRequestResourceJoiSchema, updateRequestResourceJoiSchema };
