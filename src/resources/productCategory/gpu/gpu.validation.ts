/**
 * // page 2
  gpuChipset: string; // NVIDIA GeForce RTX 3080,
  gpuMemory: number; // 10 GB, 16 GB, etc.
  gpuMemoryUnit: MemoryUnit; // GB, etc.
  gpuCoreClock: number; // 1440 MHz, 1770 MHz, etc.
  gpuBoostClock: number; // 1710 MHz, 2250 MHz, etc.
  gpuTdp: number; // 320 W, 350 W, etc.
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
  GPU_CHIPSET_REGEX,
  MEMORY_UNIT_REGEX,
} from "../../../regex";

const createGpuJoiSchema = Joi.object({
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

  gpuChipset: Joi.string().regex(GPU_CHIPSET_REGEX).required(),
  gpuMemory: Joi.number().required(),
  gpuMemoryUnit: Joi.string().regex(MEMORY_UNIT_REGEX).required(),
  gpuCoreClock: Joi.number().required(),
  gpuBoostClock: Joi.number().required(),
  gpuTdp: Joi.number().required(),
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

const updateGpuJoiSchema = Joi.object({
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

  gpuChipset: Joi.string().regex(GPU_CHIPSET_REGEX),
  gpuMemory: Joi.number(),
  gpuMemoryUnit: Joi.string().regex(MEMORY_UNIT_REGEX),
  gpuCoreClock: Joi.number(),
  gpuBoostClock: Joi.number(),
  gpuTdp: Joi.number(),
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

export { createGpuJoiSchema, updateGpuJoiSchema };
