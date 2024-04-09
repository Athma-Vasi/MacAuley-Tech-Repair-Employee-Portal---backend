/**
 * // page 2 -> cpu
  cpuSocket: string; // LGA 1200, AM4, etc.
  cpuFrequency: number; // 3.6 GHz, 4.2 GHz, etc.
  cpuCores: number; // 6 cores, 8 cores, etc.
  cpuL1Cache: number; // 384, 512, etc.
  cpuL1CacheUnit: MemoryUnit; // KB, etc.
  cpuL2Cache: number; // 1.5, 2, etc.
  cpuL2CacheUnit: MemoryUnit; // MB, etc.
  cpuL3Cache: number; // 12, 16, etc.
  cpuL3CacheUnit: MemoryUnit; // MB, etc.
  cpuWattage: number; // 65 W, 95 W, etc.

  // page 2 -> gpu
  gpuChipset: string; // NVIDIA GeForce RTX 3080,
  gpuMemory: number; // 10 GB, 16 GB, etc.
  gpuMemoryUnit: MemoryUnit; // GB, etc.
  gpuCoreClock: number; // 1440 MHz, 1770 MHz, etc.
  gpuBoostClock: number; // 1710 MHz, 2250 MHz, etc.
  gpuTdp: number; // 320 W, 350 W, etc.

  // page 2 -> ram
  ramDataRate: number; // 3200 MT/s, 3600 MT/s, etc.
  ramModulesQuantity: number;
  ramModulesCapacity: number;
  ramModulesCapacityUnit: MemoryUnit; // GB, etc.
  ramType: MemoryType; // DDR4, etc.
  ramColor: string; // Black, White, etc.
  ramVoltage: number; // 1.35 V, etc.
  ramTiming: string; // 16-18-18-38, etc.

  // page 2 -> storage
  storageType: StorageType; // SSD, HDD, etc.
  storageCapacity: number; // 1, 2, etc.
  storageCapacityUnit: MemoryUnit; // TB, etc.
  storageCache: number; // 64 MB, 128 MB, etc.
  storageCacheUnit: MemoryUnit; // MB, etc.
  storageFormFactor: StorageFormFactor; // 2.5", M.2 2280, etc.
  storageInterface: StorageInterface; // SATA III, PCIe 3.0 x4, etc.

  // page 2 -> display
  displaySize: number; // 24", 27", etc.
  displayHorizontalResolution: number;
  displayVerticalResolution: number;
  displayRefreshRate: number; // 144 Hz, 165 Hz, etc.
  displayPanelType: DisplayPanelType; // IPS, TN, etc.
  displayResponseTime: number; // 1 ms, 4 ms, etc.
  displayAspectRatio: string; // 16:9, 21:9, etc.

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
  CPU_SOCKET_REGEX,
  MEMORY_UNIT_REGEX,
  GPU_CHIPSET_REGEX,
  MEMORY_TYPE_REGEX,
  COLOR_VARIANT_REGEX,
  RAM_TIMING_REGEX,
  STORAGE_FORM_FACTOR_REGEX,
  STORAGE_INTERFACE_REGEX,
  STORAGE_TYPE_REGEX,
  DISPLAY_ASPECT_RATIO_REGEX,
  DISPLAY_PANEL_TYPE_REGEX,
} from "../../../regex";

const createLaptopJoiSchema = Joi.object({
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

  // cpu
  cpuSocket: Joi.string().regex(CPU_SOCKET_REGEX).required(),
  cpuFrequency: Joi.number().required(),
  cpuCores: Joi.number().required(),
  cpuL1Cache: Joi.number().required(),
  cpuL1CacheUnit: Joi.string().regex(MEMORY_UNIT_REGEX).required(),
  cpuL2Cache: Joi.number().required(),
  cpuL2CacheUnit: Joi.string().regex(MEMORY_UNIT_REGEX).required(),
  cpuL3Cache: Joi.number().required(),
  cpuL3CacheUnit: Joi.string().regex(MEMORY_UNIT_REGEX).required(),
  cpuWattage: Joi.number().required(),

  // gpu
  gpuChipset: Joi.string().regex(GPU_CHIPSET_REGEX).required(),
  gpuMemory: Joi.number().required(),
  gpuMemoryUnit: Joi.string().regex(MEMORY_UNIT_REGEX).required(),
  gpuCoreClock: Joi.number().required(),
  gpuBoostClock: Joi.number().required(),
  gpuTdp: Joi.number().required(),

  // ram
  ramDataRate: Joi.number().required(),
  ramModulesQuantity: Joi.number().required(),
  ramModulesCapacity: Joi.number().required(),
  ramModulesCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX).required(),
  ramType: Joi.string().regex(MEMORY_TYPE_REGEX).required(),
  ramColor: Joi.string().regex(COLOR_VARIANT_REGEX).required(),
  ramVoltage: Joi.number().required(),
  ramTiming: Joi.string().regex(RAM_TIMING_REGEX).required(),

  // storage
  storageType: Joi.string().regex(STORAGE_TYPE_REGEX).required(),
  storageCapacity: Joi.number().required(),
  storageCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX).required(),
  storageCache: Joi.number().required(),
  storageCacheUnit: Joi.string().regex(MEMORY_UNIT_REGEX).required(),
  storageFormFactor: Joi.string().regex(STORAGE_FORM_FACTOR_REGEX).required(),
  storageInterface: Joi.string().regex(STORAGE_INTERFACE_REGEX).required(),

  // display
  displaySize: Joi.number().required(),
  displayHorizontalResolution: Joi.number().required(),
  displayVerticalResolution: Joi.number().required(),
  displayRefreshRate: Joi.number().required(),
  displayPanelType: Joi.string().regex(DISPLAY_PANEL_TYPE_REGEX).required(),
  displayResponseTime: Joi.number().required(),
  displayAspectRatio: Joi.string().regex(DISPLAY_ASPECT_RATIO_REGEX).required(),
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

const updateLaptopJoiSchema = Joi.object({
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

  // cpu
  cpuSocket: Joi.string().regex(CPU_SOCKET_REGEX).optional(),
  cpuFrequency: Joi.number().optional(),
  cpuCores: Joi.number().optional(),
  cpuL1Cache: Joi.number().optional(),
  cpuL1CacheUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  cpuL2Cache: Joi.number().optional(),
  cpuL2CacheUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  cpuL3Cache: Joi.number().optional(),
  cpuL3CacheUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  cpuWattage: Joi.number().optional(),

  // gpu
  gpuChipset: Joi.string().regex(GPU_CHIPSET_REGEX).optional(),
  gpuMemory: Joi.number().optional(),
  gpuMemoryUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  gpuCoreClock: Joi.number().optional(),
  gpuBoostClock: Joi.number().optional(),
  gpuTdp: Joi.number().optional(),

  // ram
  ramDataRate: Joi.number().optional(),
  ramModulesQuantity: Joi.number().optional(),
  ramModulesCapacity: Joi.number().optional(),
  ramModulesCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  ramType: Joi.string().regex(MEMORY_TYPE_REGEX).optional(),
  ramColor: Joi.string().regex(COLOR_VARIANT_REGEX).optional(),
  ramVoltage: Joi.number().optional(),
  ramTiming: Joi.string().regex(RAM_TIMING_REGEX).optional(),

  // storage
  storageType: Joi.string().regex(STORAGE_TYPE_REGEX).optional(),
  storageCapacity: Joi.number().optional(),
  storageCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  storageCache: Joi.number().optional(),
  storageCacheUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  storageFormFactor: Joi.string().regex(STORAGE_FORM_FACTOR_REGEX).optional(),
  storageInterface: Joi.string().regex(STORAGE_INTERFACE_REGEX).optional(),

  // display
  displaySize: Joi.number().optional(),
  displayHorizontalResolution: Joi.number().optional(),
  displayVerticalResolution: Joi.number().optional(),
  displayRefreshRate: Joi.number().optional(),
  displayPanelType: Joi.string().regex(DISPLAY_PANEL_TYPE_REGEX).optional(),
  displayResponseTime: Joi.number().optional(),
  displayAspectRatio: Joi.string().regex(DISPLAY_ASPECT_RATIO_REGEX).optional(),
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

export { createLaptopJoiSchema, updateLaptopJoiSchema };
