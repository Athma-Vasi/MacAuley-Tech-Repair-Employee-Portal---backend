import Joi from "joi";
import {
  BRAND_REGEX,
  CASE_SIDE_PANEL_REGEX,
  CASE_TYPE_REGEX,
  COLOR_VARIANT_REGEX,
  CPU_SOCKET_REGEX,
  CURRENCY_REGEX,
  DIMENSION_UNIT_REGEX,
  DISPLAY_ASPECT_RATIO_REGEX,
  DISPLAY_PANEL_TYPE_REGEX,
  FREQUENCY_RESPONSE_REGEX,
  GPU_CHIPSET_REGEX,
  GRAMMAR_TEXTAREA_INPUT_REGEX,
  KEYBOARD_BACKLIGHT_REGEX,
  KEYBOARD_LAYOUT_REGEX,
  KEYBOARD_SWITCH_REGEX,
  MEMORY_TYPE_REGEX,
  MEMORY_UNIT_REGEX,
  MOTHERBOARD_CHIPSET_REGEX,
  MOTHERBOARD_FORM_FACTOR_REGEX,
  MOTHERBOARD_SOCKET_REGEX,
  MOUSE_SENSOR_REGEX,
  PERIPHERALS_INTERFACE_REGEX,
  PRODUCT_AVAILABILITY_REGEX,
  PSU_EFFICIENCY_REGEX,
  PSU_FORM_FACTOR_REGEX,
  PSU_MODULARITY_REGEX,
  RAM_TIMING_REGEX,
  SERIAL_ID_REGEX,
  SPEAKER_INTERFACE_REGEX,
  SPEAKER_TYPE_REGEX,
  STORAGE_FORM_FACTOR_REGEX,
  STORAGE_INTERFACE_REGEX,
  STORAGE_TYPE_REGEX,
  WEIGHT_UNIT_REGEX,
} from "../../../regex";

const createDesktopComputerJoiSchema = Joi.object({
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
  additionalComments: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX)
    .required(),

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

  // display
  displaySize: Joi.number().optional(),
  displayHorizontalResolution: Joi.number().optional(),
  displayVerticalResolution: Joi.number().optional(),
  displayRefreshRate: Joi.number().optional(),
  displayPanelType: Joi.string().regex(DISPLAY_PANEL_TYPE_REGEX).optional(),
  displayResponseTime: Joi.number().optional(),
  displayAspectRatio: Joi.string().regex(DISPLAY_ASPECT_RATIO_REGEX).optional(),

  // case
  caseType: Joi.string().regex(CASE_TYPE_REGEX).optional(),
  caseColor: Joi.string().regex(COLOR_VARIANT_REGEX).optional(),
  caseSidePanel: Joi.string().regex(CASE_SIDE_PANEL_REGEX).optional(),

  // keyboard
  keyboardSwitch: Joi.string().regex(KEYBOARD_SWITCH_REGEX).optional(),
  keyboardLayout: Joi.string().regex(KEYBOARD_LAYOUT_REGEX).optional(),
  keyboardBacklight: Joi.string().regex(KEYBOARD_BACKLIGHT_REGEX).optional(),
  keyboardInterface: Joi.string().regex(PERIPHERALS_INTERFACE_REGEX).optional(),

  // motherboard
  motherboardSocket: Joi.string().regex(MOTHERBOARD_SOCKET_REGEX).optional(),
  motherboardChipset: Joi.string().regex(MOTHERBOARD_CHIPSET_REGEX).optional(),
  motherboardFormFactor: Joi.string().regex(MOTHERBOARD_FORM_FACTOR_REGEX)
    .optional(),
  motherboardMemoryMax: Joi.number().optional(),
  motherboardMemoryMaxUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  motherboardMemorySlots: Joi.number().optional(),
  motherboardMemoryType: Joi.string().regex(MEMORY_TYPE_REGEX).optional(),
  motherboardSataPorts: Joi.number().optional(),
  motherboardM2Slots: Joi.number().optional(),
  motherboardPcie3Slots: Joi.number().optional(),
  motherboardPcie4Slots: Joi.number().optional(),
  motherboardPcie5Slots: Joi.number().optional(),

  // mouse
  mouseSensor: Joi.string().regex(MOUSE_SENSOR_REGEX).optional(),
  mouseDpi: Joi.number().optional(),
  mouseButtons: Joi.number().optional(),
  mouseColor: Joi.string().regex(COLOR_VARIANT_REGEX).optional(),
  mouseInterface: Joi.string().regex(PERIPHERALS_INTERFACE_REGEX).optional(),

  // psu
  psuWattage: Joi.number().optional(),
  psuEfficiency: Joi.string().regex(PSU_EFFICIENCY_REGEX).optional(),
  psuFormFactor: Joi.string().regex(PSU_FORM_FACTOR_REGEX).optional(),
  psuModularity: Joi.string().regex(PSU_MODULARITY_REGEX).optional(),

  // speaker
  speakerType: Joi.string().regex(SPEAKER_TYPE_REGEX).optional(),
  speakerTotalWattage: Joi.number().optional(),
  speakerFrequencyResponse: Joi.string().regex(FREQUENCY_RESPONSE_REGEX)
    .optional(),
  speakerColor: Joi.string().regex(COLOR_VARIANT_REGEX).optional(),
  speakerInterface: Joi.string().regex(SPEAKER_INTERFACE_REGEX).optional(),

  // storage
  storageType: Joi.string().regex(STORAGE_TYPE_REGEX).optional(),
  storageCapacity: Joi.number().optional(),
  storageCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  storageCache: Joi.number().optional(),
  storageCacheUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  storageFormFactor: Joi.string().regex(STORAGE_FORM_FACTOR_REGEX).optional(),
  storageInterface: Joi.string().regex(STORAGE_INTERFACE_REGEX).optional(),
  additionalFields: Joi.object().optional(),

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

const updateDesktopComputerJoiSchema = Joi.object({
  sku: Joi.array().items(Joi.string().optional()).optional(),
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
  additionalComments: Joi.string().regex(GRAMMAR_TEXTAREA_INPUT_REGEX)
    .optional(),

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

  // display
  displaySize: Joi.number().optional(),
  displayHorizontalResolution: Joi.number().optional(),
  displayVerticalResolution: Joi.number().optional(),
  displayRefreshRate: Joi.number().optional(),
  displayPanelType: Joi.string().regex(DISPLAY_PANEL_TYPE_REGEX).optional(),
  displayResponseTime: Joi.number().optional(),
  displayAspectRatio: Joi.string().regex(DISPLAY_ASPECT_RATIO_REGEX).optional(),

  // case
  caseType: Joi.string().regex(CASE_TYPE_REGEX).optional(),
  caseColor: Joi.string().regex(COLOR_VARIANT_REGEX).optional(),
  caseSidePanel: Joi.string().regex(CASE_SIDE_PANEL_REGEX).optional(),

  // keyboard
  keyboardSwitch: Joi.string().regex(KEYBOARD_SWITCH_REGEX).optional(),
  keyboardLayout: Joi.string().regex(KEYBOARD_LAYOUT_REGEX).optional(),
  keyboardBacklight: Joi.string().regex(KEYBOARD_BACKLIGHT_REGEX).optional(),
  keyboardInterface: Joi.string().regex(PERIPHERALS_INTERFACE_REGEX).optional(),

  // motherboard
  motherboardSocket: Joi.string().regex(MOTHERBOARD_SOCKET_REGEX).optional(),
  motherboardChipset: Joi.string().regex(MOTHERBOARD_CHIPSET_REGEX).optional(),
  motherboardFormFactor: Joi.string().regex(MOTHERBOARD_FORM_FACTOR_REGEX)
    .optional(),
  motherboardMemoryMax: Joi.number().optional(),
  motherboardMemoryMaxUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  motherboardMemorySlots: Joi.number().optional(),
  motherboardMemoryType: Joi.string().regex(MEMORY_TYPE_REGEX).optional(),
  motherboardSataPorts: Joi.number().optional(),
  motherboardM2Slots: Joi.number().optional(),
  motherboardPcie3Slots: Joi.number().optional(),
  motherboardPcie4Slots: Joi.number().optional(),
  motherboardPcie5Slots: Joi.number().optional(),

  // mouse
  mouseSensor: Joi.string().regex(MOUSE_SENSOR_REGEX).optional(),
  mouseDpi: Joi.number().optional(),
  mouseButtons: Joi.number().optional(),
  mouseColor: Joi.string().regex(COLOR_VARIANT_REGEX).optional(),
  mouseInterface: Joi.string().regex(PERIPHERALS_INTERFACE_REGEX).optional(),

  // psu
  psuWattage: Joi.number().optional(),
  psuEfficiency: Joi.string().regex(PSU_EFFICIENCY_REGEX).optional(),
  psuFormFactor: Joi.string().regex(PSU_FORM_FACTOR_REGEX).optional(),
  psuModularity: Joi.string().regex(PSU_MODULARITY_REGEX).optional(),

  // speaker
  speakerType: Joi.string().regex(SPEAKER_TYPE_REGEX).optional(),
  speakerTotalWattage: Joi.number().optional(),
  speakerFrequencyResponse: Joi.string().regex(FREQUENCY_RESPONSE_REGEX)
    .optional(),
  speakerColor: Joi.string().regex(COLOR_VARIANT_REGEX).optional(),
  speakerInterface: Joi.string().regex(SPEAKER_INTERFACE_REGEX).optional(),

  // storage
  storageType: Joi.string().regex(STORAGE_TYPE_REGEX).optional(),
  storageCapacity: Joi.number().optional(),
  storageCapacityUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  storageCache: Joi.number().optional(),
  storageCacheUnit: Joi.string().regex(MEMORY_UNIT_REGEX).optional(),
  storageFormFactor: Joi.string().regex(STORAGE_FORM_FACTOR_REGEX).optional(),
  storageInterface: Joi.string().regex(STORAGE_INTERFACE_REGEX).optional(),
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

export { createDesktopComputerJoiSchema, updateDesktopComputerJoiSchema };
