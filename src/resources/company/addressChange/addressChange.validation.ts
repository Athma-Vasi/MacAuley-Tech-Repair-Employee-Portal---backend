import Joi from "joi";
import {
  ADDRESS_LINE_REGEX,
  CITY_REGEX,
  PHONE_NUMBER_REGEX,
  REQUEST_STATUS_REGEX,
} from "../../../regex";

const createAddressChangeJoiSchema = Joi.object({
  contactNumber: Joi.string().regex(PHONE_NUMBER_REGEX).required(),
  addressLine: Joi.string().regex(ADDRESS_LINE_REGEX).required(),
  city: Joi.string().regex(CITY_REGEX).required(),
  province: Joi.string().allow("").optional(),
  state: Joi.string().allow("").optional(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
  acknowledgement: Joi.boolean().required(),
  requestStatus: Joi.string().regex(REQUEST_STATUS_REGEX).required(),
});

const updateAddressChangeJoiSchema = Joi.object({
  contactNumber: Joi.string().regex(PHONE_NUMBER_REGEX),
  addressLine: Joi.string().regex(ADDRESS_LINE_REGEX),
  city: Joi.string().regex(CITY_REGEX),
  province: Joi.string().allow(""),
  state: Joi.string().allow(""),
  postalCode: Joi.string(),
  country: Joi.string(),
  acknowledgement: Joi.boolean(),
  requestStatus: Joi.string().regex(REQUEST_STATUS_REGEX),
});

export { createAddressChangeJoiSchema, updateAddressChangeJoiSchema };
