/**
 * type EndorsementSchema = {
  userId: Types.ObjectId;
  title: string;
  username: string;
  userToBeEndorsed: string;
  summaryOfEndorsement: string;
  attributeEndorsed: EmployeeAttributes;
  requestStatus: RequestStatus;
};
 */

import Joi from "joi";
import {
  EMPLOYEE_ATTRIBUTES_REGEX,
  FULL_NAME_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  GRAMMAR_TEXT_INPUT_REGEX,
} from "../../../../regex";

const createEndorsementJoiSchema = Joi.object({
  title: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX).required(),
  userToBeEndorsed: Joi.string().regex(FULL_NAME_REGEX).required(),
  summaryOfEndorsement: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),
  attributeEndorsed: Joi.array()
    .items(Joi.string().regex(EMPLOYEE_ATTRIBUTES_REGEX))
    .required(),
});

const updateEndorsementJoiSchema = Joi.object({
  title: Joi.string().regex(GRAMMAR_TEXT_INPUT_REGEX),
  userToBeEndorsed: Joi.string().regex(FULL_NAME_REGEX),
  summaryOfEndorsement: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX),
  attributeEndorsed: Joi.array().items(Joi.string().regex(EMPLOYEE_ATTRIBUTES_REGEX)),
});

export { createEndorsementJoiSchema, updateEndorsementJoiSchema };
