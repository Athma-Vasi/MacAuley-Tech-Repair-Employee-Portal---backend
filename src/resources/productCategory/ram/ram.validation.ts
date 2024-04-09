/**
 *   ramDataRate: number; // 3200 MT/s, 3600 MT/s, etc.
  ramModulesQuantity: number;
  ramModulesCapacity: number;
  ramModulesCapacityUnit: MemoryUnit; // GB, etc.
  ramType: MemoryType; // DDR4, etc.
  ramColor: string; // Black, White, etc.
  ramVoltage: number; // 1.35 V, etc.
  ramTiming: string; // 16-18-18-38, etc.
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
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  MEMORY_TYPE_REGEX,
  MEMORY_UNIT_REGEX,
  PRODUCT_AVAILABILITY_REGEX,
  RAM_TIMING_REGEX,
  SERIAL_ID_REGEX,
  WEIGHT_UNIT_REGEX,
} from "../../../regex";

const createRamJoiSchema = Joi.object({
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

  ramDataRate: Joi.number().required(),
  ramModulesQuantity: Joi.number().required(),
  ramModulesCapacity: Joi.number().required(),
  ramModulesCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX).required(),
  ramType: Joi.string().regex(MEMORY_TYPE_REGEX).required(),
  ramColor: Joi.string().regex(COLOR_VARIANT_REGEX).required(),
  ramVoltage: Joi.number().required(),
  ramTiming: Joi.string().regex(RAM_TIMING_REGEX).required(),
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

const updateRamJoiSchema = Joi.object({
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

  ramDataRate: Joi.number(),
  ramModulesQuantity: Joi.number(),
  ramModulesCapacity: Joi.number(),
  ramModulesCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX),
  ramType: Joi.string().regex(MEMORY_TYPE_REGEX),
  ramColor: Joi.string().regex(COLOR_VARIANT_REGEX),
  ramVoltage: Joi.number(),
  ramTiming: Joi.string().regex(RAM_TIMING_REGEX),
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

export { createRamJoiSchema, updateRamJoiSchema };
