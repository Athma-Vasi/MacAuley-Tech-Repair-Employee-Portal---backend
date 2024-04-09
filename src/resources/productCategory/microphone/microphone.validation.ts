/**
 *   microphoneType: MicrophoneType; // Condenser, Dynamic, etc.
  microphonePolarPattern: MicrophonePolarPattern; // Cardioid, etc.
  microphoneFrequencyResponse: string; // 20Hz-20kHz, etc.
  microphoneColor: string; // Black, White, etc.
  microphoneInterface: MicrophoneInterface; // XLR, USB, etc.
  additionalFields: {
    [key: string]: string;
  };

 */

import Joi from "joi";
import {
  BRAND_REGEX,
  COLOR_VARIANT_REGEX,
  CURRENCY_REGEX,
  DIMENSION_UNIT_REGEX,
  FREQUENCY_RESPONSE_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  MICROPHONE_INTERFACE_REGEX,
  MICROPHONE_POLAR_PATTERN_REGEX,
  MICROPHONE_TYPE_REGEX,
  PRODUCT_AVAILABILITY_REGEX,
  SERIAL_ID_REGEX,
  WEIGHT_UNIT_REGEX,
} from "../../../regex";

const createMicrophoneJoiSchema = Joi.object({
  sku: Joi.array().items(Joi.string().optional()).required(),
  brand: Joi.string().regex(BRAND_REGEX).required(),
  model: Joi.string().regex(SERIAL_ID_REGEX).required(),
  description: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),
  price: Joi.number().required(),
  currency: Joi.string().regex(CURRENCY_REGEX).required(),
  availability: Joi.string().regex(PRODUCT_AVAILABILITY_REGEX).required(),
  quantity: Joi.number().required(),
  weight: Joi.number().required(),
  weightUnit: Joi.string().regex(WEIGHT_UNIT_REGEX).required(),
  length: Joi.number().required(),
  lengthUnit: Joi.string().regex(DIMENSION_UNIT_REGEX).required(),
  width: Joi.number().required(),
  widthUnit: Joi.string().regex(DIMENSION_UNIT_REGEX).required(),
  height: Joi.number().required(),
  heightUnit: Joi.string().regex(DIMENSION_UNIT_REGEX).required(),
  additionalComments: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).required(),

  microphoneType: Joi.string().regex(MICROPHONE_TYPE_REGEX).required(),
  microphonePolarPattern: Joi.string().regex(MICROPHONE_POLAR_PATTERN_REGEX).required(),
  microphoneFrequencyResponse: Joi.string().regex(FREQUENCY_RESPONSE_REGEX).required(),
  microphoneColor: Joi.string().regex(COLOR_VARIANT_REGEX).required(),
  microphoneInterface: Joi.string().regex(MICROPHONE_INTERFACE_REGEX).required(),
  additionalFields: Joi.object().required(),

  starRatingsCount: Joi.object({
    halfStar: Joi.number().required(),
    oneStar: Joi.number().required(),
    oneAndHalfStars: Joi.number().required(),
    twoStars: Joi.number().required(),
    twoAndHalfStars: Joi.number().required(),
    threeStars: Joi.number().required(),
    threeAndHalfStars: Joi.number().required(),
    fourStars: Joi.number().required(),
    fourAndHalfStars: Joi.number().required(),
    fiveStars: Joi.number().required(),
  }).required(),
  productReviewIds: Joi.array().items(Joi.string().optional()).required(),
  uploadedFilesIds: Joi.array().items(Joi.string().optional()).required(),
});

const updateMicrophoneJoiSchema = Joi.object({
  sku: Joi.array().items(Joi.string().optional()),
  brand: Joi.string().regex(BRAND_REGEX),
  model: Joi.string().regex(SERIAL_ID_REGEX),
  description: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX),
  price: Joi.number(),
  currency: Joi.string().regex(CURRENCY_REGEX),
  availability: Joi.string().regex(PRODUCT_AVAILABILITY_REGEX),
  quantity: Joi.number(),
  weight: Joi.number(),
  weightUnit: Joi.string().regex(WEIGHT_UNIT_REGEX),
  length: Joi.number(),
  lengthUnit: Joi.string().regex(DIMENSION_UNIT_REGEX),
  width: Joi.number(),
  widthUnit: Joi.string().regex(DIMENSION_UNIT_REGEX),
  height: Joi.number(),
  heightUnit: Joi.string().regex(DIMENSION_UNIT_REGEX),
  additionalComments: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX),

  microphoneType: Joi.string().regex(MICROPHONE_TYPE_REGEX),
  microphonePolarPattern: Joi.string().regex(MICROPHONE_POLAR_PATTERN_REGEX),
  microphoneFrequencyResponse: Joi.string().regex(FREQUENCY_RESPONSE_REGEX),
  microphoneColor: Joi.string().regex(COLOR_VARIANT_REGEX),
  microphoneInterface: Joi.string().regex(MICROPHONE_INTERFACE_REGEX),
  additionalFields: Joi.object(),

  starRatingsCount: Joi.object({
    halfStar: Joi.number(),
    oneStar: Joi.number(),
    oneAndHalfStars: Joi.number(),
    twoStars: Joi.number(),
    twoAndHalfStars: Joi.number(),
    threeStars: Joi.number(),
    threeAndHalfStars: Joi.number(),
    fourStars: Joi.number(),
    fourAndHalfStars: Joi.number(),
    fiveStars: Joi.number(),
  }),
  productReviewIds: Joi.array().items(Joi.string().optional()),
  uploadedFilesIds: Joi.array().items(Joi.string().optional()),
});

export { createMicrophoneJoiSchema, updateMicrophoneJoiSchema };
