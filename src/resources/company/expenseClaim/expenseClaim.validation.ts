import Joi from "joi";
import {
  CURRENCY_REGEX,
  EXPENSE_CLAIM_KIND_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  REQUEST_STATUS_REGEX,
} from "../../../regex";

const createExpenseClaimJoiSchema = Joi.object({
  uploadedFilesIds: Joi.array().items(Joi.string()).required(),
  expenseClaimKind: Joi.string().regex(EXPENSE_CLAIM_KIND_REGEX).required(),
  expenseClaimAmount: Joi.number().required(),
  expenseClaimCurrency: Joi.string().regex(CURRENCY_REGEX).required(),
  expenseClaimDate: Joi.date().required(),
  expenseClaimDescription: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX)
    .required(),
  additionalComments: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX)
    .required(),
  acknowledgement: Joi.boolean().required(),
  requestStatus: Joi.string().regex(REQUEST_STATUS_REGEX).required(),
});

const updateExpenseClaimJoiSchema = Joi.object({
  uploadedFilesIds: Joi.array().items(Joi.string()),
  expenseClaimKind: Joi.string().regex(EXPENSE_CLAIM_KIND_REGEX),
  expenseClaimAmount: Joi.number(),
  expenseClaimCurrency: Joi.string().regex(CURRENCY_REGEX),
  expenseClaimDate: Joi.date(),
  expenseClaimDescription: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX),
  additionalComments: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX),
  acknowledgement: Joi.boolean(),
  requestStatus: Joi.string().regex(REQUEST_STATUS_REGEX),
});

export { createExpenseClaimJoiSchema, updateExpenseClaimJoiSchema };
