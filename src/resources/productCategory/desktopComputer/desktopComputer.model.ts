import { model, Schema, Types } from "mongoose";

import { Currency } from "../../../types";
import type {
  CaseSidePanel,
  CaseType,
  DimensionUnit,
  DisplayPanelType,
  KeyboardBacklight,
  KeyboardLayout,
  KeyboardSwitch,
  MemoryType,
  MemoryUnit,
  MotherboardFormFactor,
  MouseSensor,
  PeripheralsInterface,
  ProductAvailability,
  PsuEfficiency,
  PsuFormFactor,
  PsuModularity,
  SpeakerInterface,
  SpeakerType,
  StarRatingsCount,
  StorageFormFactor,
  StorageInterface,
  StorageType,
  WeightUnit,
} from "../productCategory.types";

type DesktopComputerSchema = {
  // page 1
  sku: string[];
  brand: string;
  model: string;
  description: string;
  price: number;
  currency: Currency;
  availability: ProductAvailability;
  quantity: number;
  weight: number;
  weightUnit: WeightUnit;
  length: number;
  lengthUnit: DimensionUnit;
  width: number;
  widthUnit: DimensionUnit;
  height: number;
  heightUnit: DimensionUnit;
  additionalComments: string;

  // page 2

  // case
  caseType?: CaseType; // Mid Tower, Full Tower, etc.
  caseColor?: string; // Black, White, etc.
  caseSidePanel?: CaseSidePanel; // windowed or not

  // cpu
  cpuSocket?: string; // LGA 1200, AM4, etc.
  cpuFrequency?: number; // 3.6 GHz, 4.2 GHz, etc.
  cpuCores?: number; // 6 cores, 8 cores, etc.
  cpuL1Cache?: number; // 384, 512, etc.
  cpuL1CacheUnit?: MemoryUnit; // KB, etc.
  cpuL2Cache?: number; // 1.5, 2, etc.
  cpuL2CacheUnit?: MemoryUnit; // MB, etc.
  cpuL3Cache?: number; // 12, 16, etc.
  cpuL3CacheUnit?: MemoryUnit; // MB, etc.
  cpuWattage?: number; // 65 W, 95 W, etc.

  // display
  displaySize?: number; // 24", 27", etc.
  displayHorizontalResolution?: number;
  displayVerticalResolution?: number;
  displayRefreshRate?: number; // 144 Hz, 165 Hz, etc.
  displayPanelType?: DisplayPanelType; // IPS, TN, etc.
  displayResponseTime?: number; // 1 ms, 4 ms, etc.
  displayAspectRatio?: string; // 16?:9, 21?:9, etc.

  // gpu
  gpuChipset?: string; // NVIDIA GeForce RTX 3080,
  gpuMemory?: number; // 10 GB, 16 GB, etc.
  gpuMemoryUnit?: MemoryUnit; // GB, etc.
  gpuCoreClock?: number; // 1440 MHz, 1770 MHz, etc.
  gpuBoostClock?: number; // 1710 MHz, 2250 MHz, etc.
  gpuTdp?: number; // 320 W, 350 W, etc.

  // keyboard
  keyboardSwitch?: KeyboardSwitch; // Cherry MX Red, Cherry MX Blue, etc.
  keyboardLayout?: KeyboardLayout; // ANSI, ISO, etc.
  keyboardBacklight?: KeyboardBacklight; // RGB, etc.
  keyboardInterface?: PeripheralsInterface; // USB, Bluetooth, etc.

  // motherboard
  motherboardSocket?: string; // LGA 1200, AM4, etc.
  motherboardChipset?: string; // Intel Z490, AMD B550, etc.
  motherboardFormFactor?: MotherboardFormFactor; // ATX, Micro ATX, etc.
  motherboardMemoryMax?: number; // 128, 256, etc.
  motherboardMemoryMaxUnit?: MemoryUnit; // GB, etc.
  motherboardMemorySlots?: number; // 4, 8, etc.
  motherboardMemoryType?: MemoryType; // DDR4, etc.
  motherboardSataPorts?: number; // 6, 8, etc.
  motherboardM2Slots?: number; // 2, 3, etc.
  motherboardPcie3Slots?: number; // 2, 3, etc.
  motherboardPcie4Slots?: number; // 1, 2, etc.
  motherboardPcie5Slots?: number; // 0, 1, etc.

  // mouse
  mouseSensor?: MouseSensor; // Optical, Laser, etc.
  mouseDpi?: number; // 800, 1600, etc.
  mouseButtons?: number; // 6, 8, etc.
  mouseColor?: string; // Black, White, etc.
  mouseInterface?: PeripheralsInterface; // USB, Bluetooth, etc.

  // psu
  psuWattage?: number; // 650 W, 750 W, etc.
  psuEfficiency?: PsuEfficiency; // 80+ Gold, 80+ Platinum, etc.
  psuFormFactor?: PsuFormFactor; // ATX, SFX, etc.
  psuModularity?: PsuModularity; // Full, Semi, etc.

  // ram
  ramDataRate?: number; // 3200 MT/s, 3600 MT/s, etc.
  ramModulesQuantity?: number;
  ramModulesCapacity?: number;
  ramModulesCapacityUnit?: MemoryUnit; // GB, etc.
  ramType?: MemoryType; // DDR4, etc.
  ramColor?: string; // Black, White, etc.
  ramVoltage?: number; // 1.35 V, etc.
  ramTiming?: string; // 16-18-18-38, etc.

  // speaker
  speakerType?: SpeakerType; // 2.0, 2.1, etc.
  speakerTotalWattage?: number; // 10 W, 20 W, etc.
  speakerFrequencyResponse?: string; // 20 Hz - 20 kHz, etc.
  speakerColor?: string; // Black, White, etc.
  speakerInterface?: SpeakerInterface; // USB, Bluetooth, etc.

  // storage
  storageType?: StorageType; // SSD, HDD, etc.
  storageCapacity?: number; // 1, 2, etc.
  storageCapacityUnit?: MemoryUnit; // TB, etc.
  storageCache?: number; // 64 MB, 128 MB, etc.
  storageCacheUnit?: MemoryUnit; // MB, etc.
  storageFormFactor?: StorageFormFactor; // 2.5", M.2 2280, etc.
  storageInterface?: StorageInterface; // SATA III, PCIe 3.0 x4, etc.

  // accumulated additional fields
  additionalFields: {
    [key: string]: string;
  };

  starRatingsCount: StarRatingsCount;
  productReviewsIds: Types.ObjectId[];
  uploadedFilesIds: Types.ObjectId[];
};

type DesktopComputerDocument = DesktopComputerSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const desktopComputerSchema = new Schema<DesktopComputerSchema>(
  {
    // page 1
    sku: {
      type: [String],
      required: false,
      default: [],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    model: {
      type: String,
      required: [true, "Model is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      index: true,
    },
    availability: {
      type: String,
      required: [true, "Availability is required"],
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
    },
    weightUnit: {
      type: String,
      required: [true, "Weight unit is required"],
      index: true,
    },
    length: {
      type: Number,
      required: [true, "Length is required"],
    },
    lengthUnit: {
      type: String,
      required: [true, "Length unit is required"],
      index: true,
    },
    width: {
      type: Number,
      required: [true, "Width is required"],
    },
    widthUnit: {
      type: String,
      required: [true, "Width unit is required"],
      index: true,
    },
    height: {
      type: Number,
      required: [true, "Height is required"],
    },
    heightUnit: {
      type: String,
      required: [true, "Height unit is required"],
      index: true,
    },
    additionalComments: {
      type: String,
      required: false,
      default: "",
    },

    // page 2

    // case
    caseType: {
      type: String,
      required: false,
      index: true,
    },
    caseColor: {
      type: String,
      required: false,
    },
    caseSidePanel: {
      type: String,
      required: false,
      index: true,
    },

    // cpu
    cpuSocket: {
      type: String,
      required: false,
    },
    cpuFrequency: {
      type: Number,
      required: false,
    },
    cpuCores: {
      type: Number,
      required: false,
    },
    cpuL1Cache: {
      type: Number,
      required: false,
    },
    cpuL1CacheUnit: {
      type: String,
      required: false,
      index: true,
    },
    cpuL2Cache: {
      type: Number,
      required: false,
    },
    cpuL2CacheUnit: {
      type: String,
      required: false,
      index: true,
    },
    cpuL3Cache: {
      type: Number,
      required: false,
    },
    cpuL3CacheUnit: {
      type: String,
      required: false,
      index: true,
    },
    cpuWattage: {
      type: Number,
      required: false,
    },

    // display
    displaySize: {
      type: Number,
      required: false,
    },
    displayHorizontalResolution: {
      type: Number,
      required: false,
    },
    displayVerticalResolution: {
      type: Number,
      required: false,
    },
    displayRefreshRate: {
      type: Number,
      required: false,
    },
    displayPanelType: {
      type: String,
      required: false,
      index: true,
    },
    displayResponseTime: {
      type: Number,
      required: false,
    },
    displayAspectRatio: {
      type: String,
      required: false,
    },

    // gpu
    gpuChipset: {
      type: String,
      required: false,
    },
    gpuMemory: {
      type: Number,
      required: false,
    },
    gpuMemoryUnit: {
      type: String,
      required: false,
      index: true,
    },
    gpuCoreClock: {
      type: Number,
      required: false,
    },
    gpuBoostClock: {
      type: Number,
      required: false,
    },
    gpuTdp: {
      type: Number,
      required: false,
    },

    // keyboard
    keyboardSwitch: {
      type: String,
      required: false,
      index: true,
    },
    keyboardLayout: {
      type: String,
      required: false,
      index: true,
    },
    keyboardBacklight: {
      type: String,
      required: false,
      index: true,
    },
    keyboardInterface: {
      type: String,
      required: false,
      index: true,
    },

    // motherboard
    motherboardSocket: {
      type: String,
      required: false,
    },
    motherboardChipset: {
      type: String,
      required: false,
    },
    motherboardFormFactor: {
      type: String,
      required: false,
      index: true,
    },
    motherboardMemoryMax: {
      type: Number,
      required: false,
    },
    motherboardMemoryMaxUnit: {
      type: String,
      required: false,
    },
    motherboardMemoryType: {
      type: String,
      required: false,
      index: true,
    },
    motherboardMemorySlots: {
      type: Number,
      required: false,
      index: true,
    },
    motherboardSataPorts: {
      type: Number,
      required: false,
    },
    motherboardM2Slots: {
      type: Number,
      required: false,
    },
    motherboardPcie3Slots: {
      type: Number,
      required: false,
    },
    motherboardPcie4Slots: {
      type: Number,
      required: false,
    },
    motherboardPcie5Slots: {
      type: Number,
      required: false,
    },

    // mouse
    mouseSensor: {
      type: String,
      required: false,
      index: true,
    },
    mouseDpi: {
      type: Number,
      required: false,
    },
    mouseButtons: {
      type: Number,
      required: false,
    },
    mouseColor: {
      type: String,
      required: false,
    },
    mouseInterface: {
      type: String,
      required: false,
    },

    // psu
    psuWattage: {
      type: Number,
      required: false,
    },
    psuEfficiency: {
      type: String,
      required: false,
      index: true,
    },
    psuFormFactor: {
      type: String,
      required: false,
      index: true,
    },
    psuModularity: {
      type: String,
      required: false,
      index: true,
    },

    // ram
    ramDataRate: {
      type: Number,
      required: false,
    },
    ramModulesQuantity: {
      type: Number,
      required: false,
    },
    ramModulesCapacity: {
      type: Number,
      required: false,
    },
    ramModulesCapacityUnit: {
      type: String,
      required: false,
      index: true,
    },
    ramType: {
      type: String,
      required: false,
      index: true,
    },
    ramColor: {
      type: String,
      required: false,
      index: true,
    },
    ramVoltage: {
      type: Number,
      required: false,
    },
    ramTiming: {
      type: String,
      required: false,
    },

    // speaker
    speakerType: {
      type: String,
      required: false,
      index: true,
    },
    speakerTotalWattage: {
      type: Number,
      required: false,
    },
    speakerFrequencyResponse: {
      type: String,
      required: false,
    },
    speakerColor: {
      type: String,
      required: false,
    },
    speakerInterface: {
      type: String,
      required: false,
      index: true,
    },

    // storage
    storageType: {
      type: String,
      required: false,
      index: true,
    },
    storageCapacity: {
      type: Number,
      required: false,
    },
    storageCapacityUnit: {
      type: String,
      required: false,
    },
    storageCache: {
      type: Number,
      required: false,
    },
    storageCacheUnit: {
      type: String,
      required: false,
    },
    storageFormFactor: {
      type: String,
      required: false,
      index: true,
    },
    storageInterface: {
      type: String,
      required: false,
      index: true,
    },

    // user defined fields
    additionalFields: {
      type: Object,
      required: false,
      default: {},
    },

    starRatingsCount: {
      type: Object,
      required: false,
      default: {
        halfStar: 0,
        oneStar: 0,
        oneAndHalfStars: 0,
        twoStars: 0,
        twoAndHalfStars: 0,
        threeStars: 0,
        threeAndHalfStars: 0,
        fourStars: 0,
        fourAndHalfStars: 0,
        fiveStars: 0,
      },
    },
    productReviewsIds: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: [],
      ref: "Review",
      index: true,
    },
    uploadedFilesIds: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: [],
      ref: "FileUpload",
      index: true,
    },
  },
  { timestamps: true },
);

// text indexes for searching all user entered text input fields
desktopComputerSchema.index({
  brand: "text",
  model: "text",
  description: "text",
  additionalComments: "text",

  // cpu
  cpuSocket: "text",
  // gpu
  gpuChipset: "text",
  // motherboard
  motherboardSocket: "text",
  motherboardChipset: "text",
  // ram
  ramColor: "text",
  // computer case
  caseColor: "text",
  // display
  displayAspectRatio: "text",
  // mouse
  mouseColor: "text",
  // speaker
  speakerFrequencyResponse: "text",
  speakerColor: "text",
});

const DesktopComputerModel = model<DesktopComputerDocument>(
  "DesktopComputer",
  desktopComputerSchema,
);

export { DesktopComputerModel };
export type { DesktopComputerDocument, DesktopComputerSchema };
