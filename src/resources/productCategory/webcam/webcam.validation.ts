/**
 *   webcamResolution: WebcamResolution; // 720p, 1080p, etc.
  webcamInterface: WebcamInterface; // USB, Bluetooth, etc.
  webcamMicrophone: WebcamMicrophone; // Yes, No
  webcamFrameRate: WebcamFrameRate; // 30 fps, 60 fps, etc.
  webcamColor: string; // Black, White, etc.
  additionalFields: {
    [key: string]: string;
  };

 */

import Joi from "joi";
import {
  BRAND_REGEX,
  SERIAL_ID_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  CURRENCY_REGEX,
  PRODUCT_AVAILABILITY_REGEX,
  WEIGHT_UNIT_REGEX,
  DIMENSION_UNIT_REGEX,
  WEBCAM_RESOLUTION_REGEX,
  WEBCAM_INTERFACE_REGEX,
  WEBCAM_MICROPHONE_REGEX,
  WEBCAM_FRAME_RATE_REGEX,
  COLOR_VARIANT_REGEX,
} from "../../../regex";

const createWebcamJoiSchema = Joi.object({
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

  webcamResolution: Joi.string().regex(WEBCAM_RESOLUTION_REGEX).required(),
  webcamInterface: Joi.string().regex(WEBCAM_INTERFACE_REGEX).required(),
  webcamMicrophone: Joi.string().regex(WEBCAM_MICROPHONE_REGEX).required(),
  webcamFrameRate: Joi.string().regex(WEBCAM_FRAME_RATE_REGEX).required(),
  webcamColor: Joi.string().regex(COLOR_VARIANT_REGEX).required(),
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

const updateWebcamJoiSchema = Joi.object({
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

  webcamResolution: Joi.string().regex(WEBCAM_RESOLUTION_REGEX),
  webcamInterface: Joi.string().regex(WEBCAM_INTERFACE_REGEX),
  webcamMicrophone: Joi.string().regex(WEBCAM_MICROPHONE_REGEX),
  webcamFrameRate: Joi.string().regex(WEBCAM_FRAME_RATE_REGEX),
  webcamColor: Joi.string().regex(COLOR_VARIANT_REGEX),
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

export { createWebcamJoiSchema, updateWebcamJoiSchema };
