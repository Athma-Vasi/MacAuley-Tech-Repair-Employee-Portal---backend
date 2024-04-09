/**
 * type PaymentInformation = {
	cardholderName: string;
	cardNumber: string;
	expirationDate: string;
	cvv: string;
	billingAddress: Address;
};

type CustomerSchema = {
	username: string;
	password: string;
	email: string;

	firstName: string;
	middleName: string;
	lastName: string;
	preferredName: string;
	preferredPronouns: PreferredPronouns;
	profilePictureUrl: string;
	dateOfBirth: NativeDate;

	contactNumber: PhoneNumber;
	address: Address;
	paymentInformation: PaymentInformation;
	productReviewsIds: (Types.ObjectId | string)[];
	purchaseHistoryIds: (Types.ObjectId | string)[];
	rmaHistoryIds: (Types.ObjectId | string)[];

	isActive: boolean;
	completedSurveys: (Types.ObjectId | string)[];
	isPrefersReducedMotion: boolean;
};

type Address = {
    addressLine: string;
    city: string;
    province?: Province | undefined;
    state?: StatesUS | undefined;
    postalCode: PostalCode;
    country: Country;
}
 */

import Joi from "joi";
import {
  ADDRESS_LINE_REGEX,
  CITY_REGEX,
  CREDIT_CARD_CVV_REGEX,
  CREDIT_CARD_NUMBER_REGEX,
  FULL_NAME_REGEX,
  NAME_REGEX,
  PASSWORD_REGEX,
  PHONE_NUMBER_REGEX,
  PREFERRED_PRONOUNS_REGEX,
  USERNAME_REGEX,
} from "../../regex";

const ADDRESS_SCHEMA = Joi.object({
  addressLine: Joi.string().regex(ADDRESS_LINE_REGEX).required(),
  city: Joi.string().regex(CITY_REGEX).required(),
  province: Joi.string().optional().allow(""),
  state: Joi.string().optional().allow(""),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
}).required();

const PAYMENT_INFORMATION_SCHEMA = Joi.object({
  cardholderName: Joi.string().regex(FULL_NAME_REGEX).required(),
  cardNumber: Joi.string().regex(CREDIT_CARD_NUMBER_REGEX).required(),
  expirationDate: Joi.string().required(),
  cvv: Joi.string().regex(CREDIT_CARD_CVV_REGEX).required(),
  billingAddress: ADDRESS_SCHEMA,
}).required();

const createCustomerJoiSchema = Joi.object({
  username: Joi.string().regex(USERNAME_REGEX).required(),
  password: Joi.string().regex(PASSWORD_REGEX).required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().regex(NAME_REGEX).required(),
  middleName: Joi.string().regex(NAME_REGEX).allow("").optional(),
  lastName: Joi.string().regex(NAME_REGEX).required(),
  preferredName: Joi.string().regex(FULL_NAME_REGEX).required(),
  preferredPronouns: Joi.string().regex(PREFERRED_PRONOUNS_REGEX).required(),
  profilePictureUrl: Joi.string().uri().required(),
  dateOfBirth: Joi.date().required(),
  contactNumber: Joi.string().regex(PHONE_NUMBER_REGEX).required(),
  address: ADDRESS_SCHEMA,
  paymentInformation: PAYMENT_INFORMATION_SCHEMA,
  productReviewsIds: Joi.array().items(Joi.string()).required(),
  purchaseHistoryIds: Joi.array().items(Joi.string()).required(),
  rmaHistoryIds: Joi.array().items(Joi.string()).required(),
  isActive: Joi.boolean().required(),
  completedSurveys: Joi.array().items(Joi.string()).required(),
  isPrefersReducedMotion: Joi.boolean().required(),
});

const updateCustomerJoiSchema = Joi.object({
  username: Joi.string().regex(USERNAME_REGEX).optional(),
  password: Joi.string().regex(PASSWORD_REGEX).optional(),
  email: Joi.string().email().optional(),
  firstName: Joi.string().regex(NAME_REGEX).optional(),
  middleName: Joi.string().regex(NAME_REGEX).allow("").optional(),
  lastName: Joi.string().regex(NAME_REGEX).optional(),
  preferredName: Joi.string().regex(FULL_NAME_REGEX).optional(),
  preferredPronouns: Joi.string().regex(PREFERRED_PRONOUNS_REGEX).optional(),
  profilePictureUrl: Joi.string().uri().optional(),
  dateOfBirth: Joi.date().optional(),
  contactNumber: Joi.string().regex(PHONE_NUMBER_REGEX).optional(),
  address: ADDRESS_SCHEMA,
  paymentInformation: PAYMENT_INFORMATION_SCHEMA,
  productReviewsIds: Joi.array().items(Joi.string()).optional(),
  purchaseHistoryIds: Joi.array().items(Joi.string()).optional(),
  rmaHistoryIds: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
  completedSurveys: Joi.array().items(Joi.string()).optional(),
  isPrefersReducedMotion: Joi.boolean().optional(),
});

export {
  createCustomerJoiSchema,
  updateCustomerJoiSchema,
  ADDRESS_SCHEMA,
  PAYMENT_INFORMATION_SCHEMA,
};
