/**
 *   storageType: StorageType; // SSD, HDD, etc.
  storageCapacity: number; // 1, 2, etc.
  storageCapacityUnit: MemoryUnit; // TB, etc.
  storageCache: number; // 64 MB, 128 MB, etc.
  storageCacheUnit: MemoryUnit; // MB, etc.
  storageFormFactor: StorageFormFactor; // 2.5", M.2 2280, etc.
  storageInterface: StorageInterface; // SATA III, PCIe 3.0 x4, etc.
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
  STORAGE_TYPE_REGEX,
  MEMORY_UNIT_REGEX,
  STORAGE_FORM_FACTOR_REGEX,
  STORAGE_INTERFACE_REGEX,
} from "../../../regex";

const createStorageJoiSchema = Joi.object({
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

  storageType: Joi.string().regex(STORAGE_TYPE_REGEX).required(),
  storageCapacity: Joi.number().required(),
  storageCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX).required(),
  storageCache: Joi.number().required(),
  storageCacheUnit: Joi.string().regex(MEMORY_UNIT_REGEX).required(),
  storageFormFactor: Joi.string().regex(STORAGE_FORM_FACTOR_REGEX).required(),
  storageInterface: Joi.string().regex(STORAGE_INTERFACE_REGEX).required(),
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

const updateStorageJoiSchema = Joi.object({
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

  storageType: Joi.string().regex(STORAGE_TYPE_REGEX),
  storageCapacity: Joi.number(),
  storageCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX),
  storageCache: Joi.number(),
  storageCacheUnit: Joi.string().regex(MEMORY_UNIT_REGEX),
  storageFormFactor: Joi.string().regex(STORAGE_FORM_FACTOR_REGEX),
  storageInterface: Joi.string().regex(STORAGE_INTERFACE_REGEX),
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

export { createStorageJoiSchema, updateStorageJoiSchema };
