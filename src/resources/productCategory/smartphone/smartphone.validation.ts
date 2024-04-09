/**
 *   smartphoneOs: MobileOs; // Android, iOS, etc.
  smartphoneChipset: string; // Snapdragon 888, Apple A14 Bionic, etc.
  smartphoneDisplay: number; // 6.7", 6.9", etc.
  smartphoneHorizontalResolution: number;
  smartphoneVerticalResolution: number;
  smartphoneRamCapacity: number; // 12, 16, etc.
  smartphoneRamCapacityUnit: MemoryUnit; // GB, etc.
  smartphoneStorage: number; // 128 GB, 256 GB, etc.
  smartphoneBattery: number; // 5000 mAh, 6000 mAh, etc.
  smartphoneCamera: string; // 108 MP, 64 MP, etc.
  smartphoneColor: string; // Black, White, etc.
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
  MOBILE_OS_REGEX,
  SMARTPHONE_CHIPSET_REGEX,
  MEMORY_UNIT_REGEX,
  MOBILE_CAMERA_REGEX,
  COLOR_VARIANT_REGEX,
} from "../../../regex";

const createSmartphoneJoiSchema = Joi.object({
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

  smartphoneOs: Joi.string().regex(MOBILE_OS_REGEX).required(),
  smartphoneChipset: Joi.string().regex(SMARTPHONE_CHIPSET_REGEX).required(),
  smartphoneDisplay: Joi.number().required(),
  smartphoneHorizontalResolution: Joi.number().required(),
  smartphoneVerticalResolution: Joi.number().required(),
  smartphoneRamCapacity: Joi.number().required(),
  smartphoneRamCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX).required(),
  smartphoneStorage: Joi.number().required(),
  smartphoneBattery: Joi.number().required(),
  smartphoneCamera: Joi.string().regex(MOBILE_CAMERA_REGEX).required(),
  smartphoneColor: Joi.string().regex(COLOR_VARIANT_REGEX).required(),
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

const updateSmartphoneJoiSchema = Joi.object({
  sku: Joi.array().items(Joi.string().optional()).required(),
  brand: Joi.string().regex(BRAND_REGEX).optional(),
  model: Joi.string().regex(SERIAL_ID_REGEX).optional(),
  description: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).optional(),
  price: Joi.number().optional(),
  currency: Joi.string().regex(CURRENCY_REGEX).optional(),
  availability: Joi.string().regex(PRODUCT_AVAILABILITY_REGEX).optional(),
  quantity: Joi.number().optional(),
  weight: Joi.number().optional(),
  weightUnit: Joi.string().regex(WEIGHT_UNIT_REGEX).optional(),
  length: Joi.number().optional(),
  lengthUnit: Joi.string().regex(DIMENSION_UNIT_REGEX).optional(),
  width: Joi.number().optional(),
  widthUnit: Joi.string().regex(DIMENSION_UNIT_REGEX).optional(),
  height: Joi.number().optional(),
  heightUnit: Joi.string().regex(DIMENSION_UNIT_REGEX).optional(),
  additionalComments: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX).optional(),

  smartphoneOs: Joi.string().regex(MOBILE_OS_REGEX).optional(),
  smartphoneChipset: Joi.string().regex(SMARTPHONE_CHIPSET_REGEX).optional(),
  smartphoneDisplay: Joi.number().optional(),
  smartphoneHorizontalResolution: Joi.number().optional(),
  smartphoneVerticalResolution: Joi.number().optional(),
  smartphoneRamCapacity: Joi.number().optional(),
  smartphoneRamCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  smartphoneStorage: Joi.number().optional(),
  smartphoneBattery: Joi.number().optional(),
  smartphoneCamera: Joi.string().regex(MOBILE_CAMERA_REGEX).optional(),
  smartphoneColor: Joi.string().regex(COLOR_VARIANT_REGEX).optional(),
  additionalFields: Joi.object().optional(),

  starRatingsCount: Joi.object({
    halfStar: Joi.number().optional(),
    oneStar: Joi.number().optional(),
    oneAndHalfStars: Joi.number().optional(),
    twoStars: Joi.number().optional(),
    twoAndHalfStars: Joi.number().optional(),
    threeStars: Joi.number().optional(),
    threeAndHalfStars: Joi.number().optional(),
    fourStars: Joi.number().optional(),
    fourAndHalfStars: Joi.number().optional(),
    fiveStars: Joi.number().optional(),
  }).optional(),
  productReviewIds: Joi.array().items(Joi.string().optional()).optional(),
  uploadedFilesIds: Joi.array().items(Joi.string().optional()).optional(),
});

export { createSmartphoneJoiSchema, updateSmartphoneJoiSchema };
