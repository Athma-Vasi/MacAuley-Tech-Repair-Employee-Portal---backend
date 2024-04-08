import Joi from "joi";
import {
  FULL_NAME_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  REASON_FOR_LEAVE_REGEX,
  REQUEST_STATUS_REGEX,
} from "../../../../regex";

const createLeaveRequestJoiSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  reasonForLeave: Joi.string().regex(REASON_FOR_LEAVE_REGEX).required(),
  delegatedToEmployee: Joi.string().regex(FULL_NAME_REGEX).allow(""),
  delegatedResponsibilities: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).allow(""),
  additionalComments: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),
  acknowledgement: Joi.boolean().required(),
  requestStatus: Joi.string().regex(REQUEST_STATUS_REGEX).required(),
});

const updateLeaveRequestJoiSchema = Joi.object({
  startDate: Joi.date(),
  endDate: Joi.date(),
  reasonForLeave: Joi.string(),
  delegatedToEmployee: Joi.string(),
  delegatedResponsibilities: Joi.string(),
  additionalComments: Joi.string(),
  acknowledgement: Joi.boolean(),
  requestStatus: Joi.string(),
});

export { createLeaveRequestJoiSchema, updateLeaveRequestJoiSchema };
