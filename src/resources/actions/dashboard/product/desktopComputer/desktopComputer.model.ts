import { Schema, Types, model } from 'mongoose';

import type {
  DimensionUnit,
  MemoryUnit,
  ProductAvailability,
  ProductReview,
  WeightUnit,
  MobileOs,
  MemoryType,
  MotherboardFormFactor,
  StorageType,
  StorageFormFactor,
  StorageInterface,
  PsuEfficiency,
  PsuFormFactor,
  PsuModularity,
  CaseType,
  CaseSidePanel,
  DisplayPanelType,
  KeyboardSwitch,
  KeyboardLayout,
  KeyboardBacklight,
  PeripheralsInterface,
  MouseSensor,
  SpeakerType,
  SpeakerInterface,
} from '../types';
import type { Currency } from '../../../company/expenseClaim';

type DesktopComputerSchema = {
  userId: Types.ObjectId;
  username: string;

  // page 1
  brand: string;
  model: string;
  description: string;
  price: Number;
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

  // page 2 -> cpu
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
  additionalCpuFields: {
    [key: string]: string;
  };

  // page 2 -> gpu
  gpuChipset: string; // NVIDIA GeForce RTX 3080,
  gpuMemory: number; // 10 GB, 16 GB, etc.
  gpuMemoryUnit: MemoryUnit; // GB, etc.
  gpuCoreClock: number; // 1440 MHz, 1770 MHz, etc.
  gpuBoostClock: number; // 1710 MHz, 2250 MHz, etc.
  gpuTdp: number; // 320 W, 350 W, etc.
  additionalGpuFields: {
    [key: string]: string;
  };

  // page 2 -> motherboard
  motherboardSocket: string; // LGA 1200, AM4, etc.
  motherboardChipset: string; // Intel Z490, AMD B550, etc.
  motherboardFormFactor: MotherboardFormFactor; // ATX, Micro ATX, etc.
  motherboardMemoryMax: number; // 128, 256, etc.
  motherboardMemoryMaxUnit: MemoryUnit; // GB, etc.
  motherboardMemorySlots: number; // 4, 8, etc.
  motherboardMemoryType: MemoryType; // DDR4, etc.
  motherboardSataPorts: number; // 6, 8, etc.
  motherboardM2Slots: number; // 2, 3, etc.
  motherboardPcie3Slots: number; // 2, 3, etc.
  motherboardPcie4Slots: number; // 1, 2, etc.
  motherboardPcie5Slots: number; // 0, 1, etc.
  additionalMotherboardFields: {
    [key: string]: string;
  };

  // page 2 -> ram
  ramDataRate: number; // 3200 MT/s, 3600 MT/s, etc.
  ramModulesQuantity: number;
  ramModulesCapacity: number;
  ramModulesCapacityUnit: MemoryUnit; // GB, etc.
  ramType: MemoryType; // DDR4, etc.
  ramColor: string; // Black, White, etc.
  ramVoltage: number; // 1.35 V, etc.
  ramTiming: string; // 16-18-18-38, etc.
  additionalRamFields: {
    [key: string]: string;
  };

  // page 2 -> storage
  storageType: StorageType; // SSD, HDD, etc.
  storageCapacity: number; // 1, 2, etc.
  storageCapacityUnit: MemoryUnit; // TB, etc.
  storageCache: number; // 64 MB, 128 MB, etc.
  storageCacheUnit: MemoryUnit; // MB, etc.
  storageFormFactor: StorageFormFactor; // 2.5", M.2 2280, etc.
  storageInterface: StorageInterface; // SATA III, PCIe 3.0 x4, etc.
  additionalStorageFields: {
    [key: string]: string;
  };

  // page 2 -> psu
  psuWattage: number; // 650 W, 750 W, etc.
  psuEfficiency: PsuEfficiency; // 80+ Gold, 80+ Platinum, etc.
  psuFormFactor: PsuFormFactor; // ATX, SFX, etc.
  psuModularity: PsuModularity; // Full, Semi, etc.
  additionalPsuFields: {
    [key: string]: string;
  };

  // page 2 -> case
  caseType: CaseType; // Mid Tower, Full Tower, etc.
  caseColor: string; // Black, White, etc.
  caseSidePanel: CaseSidePanel; // windowed or not
  additionalCaseFields: {
    [key: string]: string;
  };

  // page 2 -> display
  displaySize: number; // 24", 27", etc.
  displayHorizontalResolution: number;
  displayVerticalResolution: number;
  displayRefreshRate: number; // 144 Hz, 165 Hz, etc.
  displayPanelType: DisplayPanelType; // IPS, TN, etc.
  displayResponseTime: number; // 1 ms, 4 ms, etc.
  displayAspectRatio: string; // 16:9, 21:9, etc.
  additionalDisplayFields: {
    [key: string]: string;
  };

  // page 2 -> keyboard
  keyboardSwitch: KeyboardSwitch; // Cherry MX Red, Cherry MX Blue, etc.
  keyboardLayout: KeyboardLayout; // ANSI, ISO, etc.
  keyboardBacklight: KeyboardBacklight; // RGB, etc.
  keyboardInterface: PeripheralsInterface; // USB, Bluetooth, etc.
  additionalKeyboardFields: {
    [key: string]: string;
  };

  // page 2 -> mouse
  mouseSensor: MouseSensor; // Optical, Laser, etc.
  mouseDpi: number; // 800, 1600, etc.
  mouseButtons: number; // 6, 8, etc.
  mouseColor: string; // Black, White, etc.
  mouseInterface: PeripheralsInterface; // USB, Bluetooth, etc.
  additionalMouseFields: {
    [key: string]: string;
  };

  // page 2 -> speaker
  speakerType: SpeakerType; // 2.0, 2.1, etc.
  speakerTotalWattage: number; // 10 W, 20 W, etc.
  speakerFrequencyResponse: string; // 20 Hz - 20 kHz, etc.
  speakerColor: string; // Black, White, etc.
  speakerInterface: SpeakerInterface; // USB, Bluetooth, etc.
  additionalSpeakerFields: {
    [key: string]: string;
  };

  // page 3
  reviews: ProductReview[];
  uploadedFilesIds: Types.ObjectId[];
};

type DesktopComputerDocument = DesktopComputerSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const desktopComputerSchema = new Schema<DesktopComputerDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },

    // page 1
    brand: {
      type: String,
      required: [true, 'Brand is required'],
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      index: true,
    },
    availability: {
      type: String,
      required: [true, 'Availability is required'],
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
    },
    weightUnit: {
      type: String,
      required: [true, 'Weight unit is required'],
      index: true,
    },
    length: {
      type: Number,
      required: [true, 'Length is required'],
    },
    lengthUnit: {
      type: String,
      required: [true, 'Length unit is required'],
      index: true,
    },
    width: {
      type: Number,
      required: [true, 'Width is required'],
    },
    widthUnit: {
      type: String,
      required: [true, 'Width unit is required'],
      index: true,
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
    },
    heightUnit: {
      type: String,
      required: [true, 'Height unit is required'],
      index: true,
    },
    additionalComments: {
      type: String,
      required: false,
      default: '',
    },

    // page 2

    // page 2 -> cpu
    cpuSocket: {
      type: String,
      required: [true, 'Socket is required'],
    },
    cpuFrequency: {
      type: Number,
      required: [true, 'Speed is required'],
    },
    cpuCores: {
      type: Number,
      required: [true, 'Cores is required'],
    },
    cpuL1Cache: {
      type: Number,
      required: [true, 'Cache is required'],
    },
    cpuL1CacheUnit: {
      type: String,
      required: [true, 'Cache unit is required'],
      index: true,
    },
    cpuL2Cache: {
      type: Number,
      required: [true, 'Cache is required'],
    },
    cpuL2CacheUnit: {
      type: String,
      required: [true, 'Cache unit is required'],
      index: true,
    },
    cpuL3Cache: {
      type: Number,
      required: [true, 'Cache is required'],
    },
    cpuL3CacheUnit: {
      type: String,
      required: [true, 'Cache unit is required'],
      index: true,
    },
    cpuWattage: {
      type: Number,
      required: [true, 'Wattage is required'],
    },
    // user defined fields
    additionalCpuFields: {
      type: Object,
      required: false,
      default: {},
    },

    // page 2 -> gpu
    gpuChipset: {
      type: String,
      required: [true, 'Chipset is required'],
    },
    gpuMemory: {
      type: Number,
      required: [true, 'Memory is required'],
    },
    gpuMemoryUnit: {
      type: String,
      required: [true, 'Memory unit is required'],
      index: true,
    },
    gpuCoreClock: {
      type: Number,
      required: [true, 'Core clock is required'],
    },
    gpuBoostClock: {
      type: Number,
      required: [true, 'Boost clock is required'],
    },
    gpuTdp: {
      type: Number,
      required: [true, 'TDP is required'],
    },
    // user defined fields
    additionalGpuFields: {
      type: Object,
      required: false,
      default: {},
    },

    // page 2 -> motherboard
    motherboardSocket: {
      type: String,
      required: [true, 'Socket is required'],
    },
    motherboardChipset: {
      type: String,
      required: [true, 'Chipset is required'],
    },
    motherboardFormFactor: {
      type: String,
      required: [true, 'Form factor is required'],
      index: true,
    },
    motherboardMemoryMax: {
      type: Number,
      required: [true, 'Memory max is required'],
    },
    motherboardMemoryMaxUnit: {
      type: String,
      required: [true, 'Memory slots is required'],
    },
    motherboardMemoryType: {
      type: String,
      required: [true, 'Memory type is required'],
      index: true,
    },
    motherboardMemorySlots: {
      type: Number,
      required: [true, 'Memory type is required'],
      index: true,
    },
    motherboardSataPorts: {
      type: Number,
      required: [true, 'SATA ports is required'],
    },
    motherboardM2Slots: {
      type: Number,
      required: [true, 'M.2 slots is required'],
    },
    motherboardPcie3Slots: {
      type: Number,
      required: [true, 'PCIe 3.0 slots is required'],
    },
    motherboardPcie4Slots: {
      type: Number,
      required: [true, 'PCIe 4.0 slots is required'],
    },
    motherboardPcie5Slots: {
      type: Number,
      required: [true, 'PCIe 5.0 slots is required'],
    },
    // user defined fields
    additionalMotherboardFields: {
      type: Object,
      required: false,
      default: {},
    },

    // page 2 -> ram
    ramDataRate: {
      type: Number,
      required: [true, 'Speed is required'],
    },
    ramModulesQuantity: {
      type: Number,
      required: [true, 'Modules quantity is required'],
    },
    ramModulesCapacity: {
      type: Number,
      required: [true, 'Modules capacity is required'],
    },
    ramModulesCapacityUnit: {
      type: String,
      required: [true, 'Modules capacity unit is required'],
      index: true,
    },
    ramType: {
      type: String,
      required: [true, 'RAM type is required'],
      index: true,
    },
    ramColor: {
      type: String,
      required: [true, 'Color is required'],
      index: true,
    },
    ramVoltage: {
      type: Number,
      required: [true, 'Voltage is required'],
    },
    ramTiming: {
      type: String,
      required: [true, 'Timing is required'],
    },
    // user defined fields
    additionalRamFields: {
      type: Object,
      required: false,
      default: {},
    },

    // page 2 -> storage
    storageType: {
      type: String,
      required: [true, 'Storage type is required'],
      index: true,
    },
    storageCapacity: {
      type: Number,
      required: [true, 'Capacity is required'],
    },
    storageCapacityUnit: {
      type: String,
      required: [true, 'Capacity unit is required'],
    },
    storageCache: {
      type: Number,
      required: [true, 'Cache is required'],
    },
    storageCacheUnit: {
      type: String,
      required: [true, 'Cache unit is required'],
    },
    storageFormFactor: {
      type: String,
      required: [true, 'Form factor is required'],
      index: true,
    },
    storageInterface: {
      type: String,
      required: [true, 'Interface is required'],
      index: true,
    },
    // user defined fields
    additionalStorageFields: {
      type: Object,
      required: false,
      default: {},
    },

    // page 2 -> psu
    psuWattage: {
      type: Number,
      required: [true, 'Wattage is required'],
    },
    psuEfficiency: {
      type: String,
      required: [true, 'Efficiency is required'],
      index: true,
    },
    psuFormFactor: {
      type: String,
      required: [true, 'Form factor is required'],
      index: true,
    },
    psuModularity: {
      type: String,
      required: [true, 'Modular is required'],
      index: true,
    },
    // user defined fields
    additionalPsuFields: {
      type: Object,
      required: false,
      default: {},
    },

    // page 2 -> case
    caseType: {
      type: String,
      required: [true, 'Case type is required'],
      index: true,
    },
    caseColor: {
      type: String,
      required: [true, 'Color is required'],
    },
    caseSidePanel: {
      type: String,
      required: [true, 'Side panel is required'],
      index: true,
    },
    // user defined fields
    additionalCaseFields: {
      type: Object,
      required: false,
      default: {},
    },

    // page 2 -> display
    displaySize: {
      type: Number,
      required: [true, 'Size is required'],
    },
    displayHorizontalResolution: {
      type: Number,
      required: [true, 'Horizontal resolution is required'],
    },
    displayVerticalResolution: {
      type: Number,
      required: [true, 'Vertical resolution is required'],
    },
    displayRefreshRate: {
      type: Number,
      required: [true, 'Refresh rate is required'],
    },
    displayPanelType: {
      type: String,
      required: [true, 'Panel type is required'],
      index: true,
    },
    displayResponseTime: {
      type: Number,
      required: [true, 'Response time is required'],
    },
    displayAspectRatio: {
      type: String,
      required: [true, 'Aspect ratio is required'],
    },
    // user defined fields
    additionalDisplayFields: {
      type: Object,
      required: false,
      default: {},
    },

    // page 2 -> keyboard
    keyboardSwitch: {
      type: String,
      required: [true, 'Switch is required'],
      index: true,
    },
    keyboardLayout: {
      type: String,
      required: [true, 'Layout is required'],
      index: true,
    },
    keyboardBacklight: {
      type: String,
      required: [true, 'Backlight is required'],
      index: true,
    },
    keyboardInterface: {
      type: String,
      required: [true, 'Interface is required'],
      index: true,
    },
    // user defined fields
    additionalKeyboardFields: {
      type: Object,
      required: false,
      default: {},
    },

    // page 2 -> mouse
    mouseSensor: {
      type: String,
      required: [true, 'Sensor is required'],
      index: true,
    },
    mouseDpi: {
      type: Number,
      required: [true, 'DPI is required'],
    },
    mouseButtons: {
      type: Number,
      required: [true, 'Buttons is required'],
    },
    mouseColor: {
      type: String,
      required: [true, 'Color is required'],
    },
    mouseInterface: {
      type: String,
      required: [true, 'Interface is required'],
    },
    // user defined fields
    additionalMouseFields: {
      type: Object,
      required: false,
      default: {},
    },

    // page 2 -> speaker
    speakerType: {
      type: String,
      required: [true, 'Type is required'],
      index: true,
    },
    speakerTotalWattage: {
      type: Number,
      required: [true, 'Total wattage is required'],
    },
    speakerFrequencyResponse: {
      type: String,
      required: [true, 'Frequency response is required'],
    },
    speakerColor: {
      type: String,
      required: [true, 'Color is required'],
    },
    speakerInterface: {
      type: String,
      required: [true, 'Interface is required'],
      index: true,
    },
    // user defined fields
    additionalSpeakerFields: {
      type: Object,
      required: false,
      default: {},
    },

    // page 3
    reviews: {
      type: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            required: [true, 'User ID is required'],
            ref: 'User',
            index: true,
          },
          username: {
            type: String,
            required: [true, 'Username is required'],
          },
          rating: {
            type: Number,
            required: [true, 'Rating is required'],
          },
          review: {
            type: String,
            required: [true, 'Review is required'],
          },
        },
      ],
      required: false,
      default: [],
    },
    uploadedFilesIds: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: [],
      ref: 'FileUpload',
      index: true,
    },
  },
  { timestamps: true }
);

// text indexes for searching all user entered text input fields
desktopComputerSchema.index({
  brand: 'text',
  model: 'text',
  description: 'text',
  additionalComments: 'text',
  // reviews
  'reviews.username': 'text',
  'reviews.review': 'text',
  // cpu
  cpuSocket: 'text',
  // gpu
  gpuChipset: 'text',
  // motherboard
  motherboardSocket: 'text',
  motherboardChipset: 'text',
  // ram
  ramColor: 'text',
  // computer case
  caseColor: 'text',
  // display
  displayAspectRatio: 'text',
  // mouse
  mouseColor: 'text',
  // speaker
  speakerFrequencyResponse: 'text',
  speakerColor: 'text',
});

const DesktopComputerModel = model<DesktopComputerDocument>(
  'DesktopComputer',
  desktopComputerSchema
);

export { DesktopComputerModel };
export type { DesktopComputerSchema, DesktopComputerDocument };
