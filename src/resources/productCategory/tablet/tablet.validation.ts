/**
 *   tabletOs: MobileOs; // Android, iOS, etc.
  tabletChipset: string; // Snapdragon 888, Apple A14 Bionic, etc.
  tabletDisplay: number; // 6.7", 6.9", etc.
  tabletHorizontalResolution: number;
  tabletVerticalResolution: number;
  tabletRamCapacity: number; // 12, 16, etc.
  tabletRamCapacityUnit: MemoryUnit; // GB, etc.
  tabletStorage: number; // 128 GB, 256 GB, etc.
  tabletBattery: number; // 5000 mAh, 6000 mAh, etc.
  tabletCamera: string; // 108 MP, 64 MP, etc.
  tabletColor: string; // Black, White, etc.
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
  TABLET_CHIPSET_REGEX,
  MEMORY_UNIT_REGEX,
  MOBILE_CAMERA_REGEX,
  COLOR_VARIANT_REGEX,
} from "../../../regex";

const createTabletJoiSchema = Joi.object({
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

  tabletOs: Joi.string().regex(MOBILE_OS_REGEX).required(),
  tabletChipset: Joi.string().regex(TABLET_CHIPSET_REGEX).required(),
  tabletDisplay: Joi.number().required(),
  tabletHorizontalResolution: Joi.number().required(),
  tabletVerticalResolution: Joi.number().required(),
  tabletRamCapacity: Joi.number().required(),
  tabletRamCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX).required(),
  tabletStorage: Joi.number().required(),
  tabletBattery: Joi.number().required(),
  tabletCamera: Joi.string().regex(MOBILE_CAMERA_REGEX).required(),
  tabletColor: Joi.string().regex(COLOR_VARIANT_REGEX).required(),
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

const updateTabletJoiSchema = Joi.object({
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

  tabletOs: Joi.string().regex(MOBILE_OS_REGEX),
  tabletChipset: Joi.string().regex(TABLET_CHIPSET_REGEX),
  tabletDisplay: Joi.number(),
  tabletHorizontalResolution: Joi.number(),
  tabletVerticalResolution: Joi.number(),
  tabletRamCapacity: Joi.number(),
  tabletRamCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX),
  tabletStorage: Joi.number(),
  tabletBattery: Joi.number(),
  tabletCamera: Joi.string().regex(MOBILE_CAMERA_REGEX),
  tabletColor: Joi.string().regex(COLOR_VARIANT_REGEX),
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

export { createTabletJoiSchema, updateTabletJoiSchema };
