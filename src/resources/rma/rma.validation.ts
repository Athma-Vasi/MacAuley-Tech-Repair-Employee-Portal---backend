import Joi from "joi";
import {
  CURRENCY_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  PRODUCT_CATEGORY_REGEX,
  RMA_STATUS_REGEX,
} from "../../regex";

const createRMAJoiSchema = Joi.object({
  purchaseDocumentId: Joi.string().required(),
  customerId: Joi.string().required(),
  productId: Joi.string().required(),
  productSku: Joi.string().required(),
  purchasePrice: Joi.number().required(),
  purchaseCurrency: Joi.string().regex(CURRENCY_REGEX).required(),
  productCategory: Joi.string().regex(PRODUCT_CATEGORY_REGEX).required(),
  rmaCode: Joi.string().required(),
  rmaDate: Joi.date().required(),
  rmaAmount: Joi.number().required(),
  rmaCurrency: Joi.string().regex(CURRENCY_REGEX).required(),
  rmaReason: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),
  rmaStatus: Joi.string().regex(RMA_STATUS_REGEX).required(),
});

const updateRMAJoiSchema = Joi.object({
  purchaseDocumentId: Joi.string().optional(),
  customerId: Joi.string().optional(),
  productId: Joi.string().optional(),
  productSku: Joi.string().optional(),
  purchasePrice: Joi.number().optional(),
  purchaseCurrency: Joi.string().regex(CURRENCY_REGEX).optional(),
  productCategory: Joi.string().regex(PRODUCT_CATEGORY_REGEX).optional(),
  rmaCode: Joi.string().optional(),
  rmaDate: Joi.date().optional(),
  rmaAmount: Joi.number().optional(),
  rmaCurrency: Joi.string().regex(CURRENCY_REGEX).optional(),
  rmaReason: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).optional(),
  rmaStatus: Joi.string().regex(RMA_STATUS_REGEX).optional(),
});

export { createRMAJoiSchema, updateRMAJoiSchema };
