import { Schema, Types, model } from 'mongoose';
import type { Action } from '../..';
import type { ActionsDashboard } from '../dashboard.types';
import { Currency } from '../../company/expenseClaim';

type ProductCategory =
  | 'Desktop Computers'
  | 'Laptops'
  | 'Central Processing Units (CPUs)'
  | 'Graphics Processing Units (GPUs)'
  | 'Motherboards'
  | 'Memory (RAM)'
  | 'Storage'
  | 'Power Supplies'
  | 'Computer Cases'
  | 'Monitors'
  | 'Keyboards'
  | 'Mice'
  | 'Headphones'
  | 'Speakers'
  | 'Smartphones'
  | 'Tablets'
  | 'Accessories';

type DesktopComputerSpecifications = {
  cpu: CpuSpecifications;
  gpu: GpuSpecifications;
  motherboard: MotherboardSpecifications;
  ram: RamSpecifications;
  storage: StorageSpecifications;
  psu: PsuSpecifications;
  case: CaseSpecifications;
  monitor: MonitorSpecifications;
  keyboard: KeyboardSpecifications;
  mouse: MouseSpecifications;
  speaker: SpeakerSpecifications;
};

type LaptopSpecifications = {
  cpu: CpuSpecifications;
  gpu: GpuSpecifications;
  ram: RamSpecifications;
  storage: StorageSpecifications;
  display: MonitorSpecifications;
};

type MemoryUnit = 'KB' | 'MB' | 'GB' | 'TB';

type CpuSpecifications = {
  cpuSocket: string; // LGA 1200, AM4, etc.
  cpuFrequency: number; // 3.6 GHz, 4.2 GHz, etc.
  cpuCores: number; // 6 cores, 8 cores, etc.
  cpuL1Cache: string; // 384, 512, etc.
  cpuL1CacheUnit: MemoryUnit; // KB, etc.
  cpuL2Cache: string; // 1.5, 2, etc.
  cpuL2CacheUnit: MemoryUnit; // MB, etc.
  cpuL3Cache: string; // 12, 16, etc.
  cpuL3CacheUnit: MemoryUnit; // MB, etc.
  cpuWattage: number; // 65 W, 95 W, etc.
};

type GpuSpecifications = {
  gpuChipset: string; // NVIDIA GeForce RTX 3080,
  gpuMemory: number; // 10 GB, 16 GB, etc.
  gpuMemoryUnit: MemoryUnit; // GB, etc.
  gpuCoreClock: number; // 1440 MHz, 1770 MHz, etc.
  gpuBoostClock: number; // 1710 MHz, 2250 MHz, etc.
  gpuTdp: number; // 320 W, 350 W, etc.
};

type MotherboardFormFactor = 'ATX' | 'Micro ATX' | 'Mini ITX' | 'E-ATX' | 'XL-ATX';
type MemoryType = 'DDR5' | 'DDR4' | 'DDR3' | 'DDR2' | 'DDR';
type MotherboardSpecifications = {
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
};

type RamSpecifications = {
  ramDataRate: number; // 3200 MT/s, 3600 MT/s, etc.
  ramModulesQuantity: number;
  ramModulesCapacity: number;
  ramModulesCapacityUnit: MemoryUnit; // GB, etc.
  ramType: MemoryType; // DDR4, etc.
  ramColor: string; // Black, White, etc.
  ramVoltage: number; // 1.35 V, etc.
  ramTiming: string; // 16-18-18-38, etc.
};

type StorageType = 'SSD' | 'HDD' | 'SSHD' | 'NVMe SSD' | 'SATA SSD' | 'M.2 SSD' | 'Other';
type StorageFormFactor = '2.5"' | 'M.2 2280' | 'M.2 22110' | 'M.2 2242' | 'M.2 2230' | 'Other';
type StorageInterface =
  | 'SATA III'
  | 'PCIe 3.0 x4'
  | 'PCIe 4.0 x4'
  | 'PCIe 3.0 x2'
  | 'PCIe 3.0 x1'
  | 'Other';
type StorageSpecifications = {
  storageType: StorageType; // SSD, HDD, etc.
  storageCapacity: number; // 1, 2, etc.
  storageCapacityUnit: MemoryUnit; // TB, etc.
  storageCache: number; // 64 MB, 128 MB, etc.
  storageCacheUnit: MemoryUnit; // MB, etc.
  storageFormFactor: StorageFormFactor; // 2.5", M.2 2280, etc.
  storageInterface: StorageInterface; // SATA III, PCIe 3.0 x4, etc.
};

type PsuEfficiency =
  | '80+ Bronze'
  | '80+ Gold'
  | '80+ Platinum'
  | '80+ Titanium'
  | '80+ Silver'
  | '80+'
  | '80+ White'
  | '80+ Standard';
type PsuModularity = 'Full' | 'Semi' | 'None' | 'Other';
type PsuFormFactor = 'ATX' | 'SFX' | 'SFX-L' | 'TFX' | 'Flex ATX' | 'Other';
type PsuSpecifications = {
  psuWattage: number; // 650 W, 750 W, etc.
  psuEfficiency: PsuEfficiency; // 80+ Gold, 80+ Platinum, etc.
  psuFormFactor: PsuFormFactor; // ATX, SFX, etc.
  psuModularity: PsuModularity; // Full, Semi, etc.
};

type CaseType = 'Mid Tower' | 'Full Tower' | 'Mini Tower' | 'Cube' | 'Slim' | 'Desktop' | 'Other';
type CaseSidePanel = 'Windowed' | 'Solid';
type CaseSpecifications = {
  caseType: CaseType; // Mid Tower, Full Tower, etc.
  caseColor: string; // Black, White, etc.
  caseSidePanel: CaseSidePanel; // windowed or not
};

type MonitorPanelType = 'IPS' | 'TN' | 'VA' | 'OLED' | 'QLED' | 'Other';

type MonitorSpecifications = {
  monitorSize: number; // 24", 27", etc.
  monitorHorizontalResolution: number;
  monitorVerticalResolution: number;
  monitorRefreshRate: number; // 144 Hz, 165 Hz, etc.
  monitorPanelType: MonitorPanelType; // IPS, TN, etc.
  monitorResponseTime: number; // 1 ms, 4 ms, etc.
  monitorAspectRatio: string; // 16:9, 21:9, etc.
};

type KeyboardSwitch =
  | 'Cherry MX Red'
  | 'Cherry MX Blue'
  | 'Cherry MX Brown'
  | 'Cherry MX Silent Red'
  | 'Cherry MX Black'
  | 'Cherry MX Clear'
  | 'Membrane'
  | 'Other';
type KeyboardLayout = 'ANSI' | 'ISO' | 'Other';
type KeyboardBacklight = 'RGB' | 'Single Color' | 'None';
type PeripheralsInterface = 'USB' | 'Bluetooth' | 'Other';
type KeyboardSpecifications = {
  keyboardSwitch: KeyboardSwitch; // Cherry MX Red, Cherry MX Blue, etc.
  keyboardLayout: KeyboardLayout; // ANSI, ISO, etc.
  keyboardBacklight: KeyboardBacklight; // RGB, etc.
  keyboardInterface: PeripheralsInterface; // USB, Bluetooth, etc.
};

type MouseSensor = 'Optical' | 'Laser' | 'Infrared' | 'Other';
type MouseSpecifications = {
  mouseSensor: MouseSensor; // Optical, Laser, etc.
  mouseDpi: number; // 800, 1600, etc.
  mouseButtons: number; // 6, 8, etc.
  mouseColor: string; // Black, White, etc.
  mouseInterface: PeripheralsInterface; // USB, Bluetooth, etc.
};

type HeadphoneType = 'Over-ear' | 'On-ear' | 'In-ear' | 'Other';
type HeadphoneInterface = 'USB' | 'Bluetooth' | '3.5 mm' | '2.5 mm' | 'Other';
type HeadphoneSpecifications = {
  headphoneType: HeadphoneType; // Over-ear, On-ear, etc.
  headphoneDriver: number; // 50 mm, 53 mm, etc.
  headphoneFrequencyResponse: string; // 20 Hz - 20 kHz, etc.
  headphoneImpedance: number; // 32 Ohm, 64 Ohm, etc.
  headphoneColor: string; // Black, White, etc.
  headphoneInterface: HeadphoneInterface; // USB, Bluetooth, etc.
};

type SpeakerType = '2.0' | '2.1' | '3.1' | '4.1' | '5.1' | '7.1' | 'Other';
type SpeakerInterface = HeadphoneInterface;
type SpeakerSpecifications = {
  speakerType: SpeakerType; // 2.0, 2.1, etc.
  speakerTotalWattage: number; // 10 W, 20 W, etc.
  speakerFrequencyResponse: string; // 20 Hz - 20 kHz, etc.
  speakerColor: string; // Black, White, etc.
  speakerInterface: SpeakerInterface; // USB, Bluetooth, etc.
};

type MobileOs = 'Android' | 'iOS' | 'Windows' | 'Linux' | 'Other';
type SmartphoneSpecifications = {
  smartphoneOs: MobileOs; // Android, iOS, etc.
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
};

type TabletSpecifications = {
  tabletOs: MobileOs; // Android, iOS, etc.
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
};

type AccessorySpecifications = {
  accessoryType: string; // Headphones, Speakers, etc.
  accessoryColor: string; // Black, White, etc.
  accessoryInterface: PeripheralsInterface; // USB, Bluetooth, etc.
  userDefinedFields: {
    [key: string]: string;
  };
};

type Specifications = {
  desktopComputer?: DesktopComputerSpecifications;
  laptop?: LaptopSpecifications;
  cpu?: CpuSpecifications;
  gpu?: GpuSpecifications;
  motherboard?: MotherboardSpecifications;
  ram?: RamSpecifications;
  storage?: StorageSpecifications;
  psu?: PsuSpecifications;
  case?: CaseSpecifications;
  monitor?: MonitorSpecifications;
  keyboard?: KeyboardSpecifications;
  mouse?: MouseSpecifications;
  headphone?: HeadphoneSpecifications;
  speaker?: SpeakerSpecifications;
  smartphone?: SmartphoneSpecifications;
  tablet?: TabletSpecifications;
  accessory?: AccessorySpecifications;
};

type DimensionUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft';
type WeightUnit = 'g' | 'kg' | 'lb';

type ProductReview = {
  userId: Types.ObjectId;
  username: string;
  rating: number;
  review: string;
};

type ProductAvailability = 'In Stock' | 'Out of Stock' | 'Pre-order' | 'Discontinued' | 'Other';

type ProductSchema = {
  userId: Types.ObjectId;
  username: string;
  action: Action;
  category: ActionsDashboard;

  // page 1
  brand: string;
  model: string;
  description: string;
  price: string;
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
  productCategory: ProductCategory;
  specifications: Specifications;

  // page 3
  reviews: ProductReview[];
  uploadedFilesIds: Types.ObjectId[];
};

type ProductDocument = ProductSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const cpuSchema = new Schema<CpuSpecifications>(
  {
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
      type: String,
      required: [true, 'Cache is required'],
    },
    cpuL1CacheUnit: {
      type: String,
      required: [true, 'Cache unit is required'],
    },
    cpuL2Cache: {
      type: String,
      required: [true, 'Cache is required'],
    },
    cpuL2CacheUnit: {
      type: String,
      required: [true, 'Cache unit is required'],
    },
    cpuL3Cache: {
      type: String,
      required: [true, 'Cache is required'],
    },
    cpuL3CacheUnit: {
      type: String,
      required: [true, 'Cache unit is required'],
    },
    cpuWattage: {
      type: Number,
      required: [true, 'Wattage is required'],
    },
  },
  {
    _id: false,
  }
);

const gpuSchema = new Schema<GpuSpecifications>(
  {
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
  },
  {
    _id: false,
  }
);

const motherboardSchema = new Schema<MotherboardSpecifications>(
  {
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
  },
  {
    _id: false,
  }
);

const ramSchema = new Schema<RamSpecifications>(
  {
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
  },
  {
    _id: false,
  }
);

const storageSchema = new Schema<StorageSpecifications>(
  {
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
  },
  {
    _id: false,
  }
);

const psuSchema = new Schema<PsuSpecifications>(
  {
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
  },
  {
    _id: false,
  }
);

const caseSchema = new Schema<CaseSpecifications>(
  {
    caseType: {
      type: String,
      required: [true, 'Case type is required'],
      index: true,
    },
    caseColor: {
      type: String,
      required: [true, 'Color is required'],
      index: true,
    },
    caseSidePanel: {
      type: String,
      required: [true, 'Side panel is required'],
      index: true,
    },
  },
  {
    _id: false,
  }
);

const monitorSchema = new Schema<MonitorSpecifications>(
  {
    monitorSize: {
      type: Number,
      required: [true, 'Size is required'],
    },
    monitorHorizontalResolution: {
      type: Number,
      required: [true, 'Horizontal resolution is required'],
    },
    monitorVerticalResolution: {
      type: Number,
      required: [true, 'Vertical resolution is required'],
    },
    monitorRefreshRate: {
      type: Number,
      required: [true, 'Refresh rate is required'],
    },
    monitorPanelType: {
      type: String,
      required: [true, 'Panel type is required'],
      index: true,
    },
    monitorResponseTime: {
      type: Number,
      required: [true, 'Response time is required'],
    },
    monitorAspectRatio: {
      type: String,
      required: [true, 'Aspect ratio is required'],
    },
  },
  {
    _id: false,
  }
);

const keyboardSchema = new Schema<KeyboardSpecifications>(
  {
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
  },
  {
    _id: false,
  }
);

const mouseSchema = new Schema<MouseSpecifications>(
  {
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
      index: true,
    },
    mouseInterface: {
      type: String,
      required: [true, 'Interface is required'],
    },
  },
  {
    _id: false,
  }
);

const headphoneSchema = new Schema<HeadphoneSpecifications>(
  {
    headphoneType: {
      type: String,
      required: [true, 'Type is required'],
      index: true,
    },
    headphoneDriver: {
      type: Number,
      required: [true, 'Driver is required'],
    },
    headphoneFrequencyResponse: {
      type: String,
      required: [true, 'Frequency response is required'],
    },
    headphoneImpedance: {
      type: Number,
      required: [true, 'Impedance is required'],
    },
    headphoneColor: {
      type: String,
      required: [true, 'Color is required'],
      index: true,
    },
    headphoneInterface: {
      type: String,
      required: [true, 'Interface is required'],
      index: true,
    },
  },
  {
    _id: false,
  }
);

const speakerSchema = new Schema<SpeakerSpecifications>(
  {
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
      index: true,
    },
    speakerInterface: {
      type: String,
      required: [true, 'Interface is required'],
      index: true,
    },
  },
  {
    _id: false,
  }
);

const smartphoneSchema = new Schema<SmartphoneSpecifications>(
  {
    smartphoneOs: {
      type: String,
      required: [true, 'OS is required'],
    },
    smartphoneChipset: {
      type: String,
      required: [true, 'Chipset is required'],
    },
    smartphoneDisplay: {
      type: Number,
      required: [true, 'Display is required'],
    },
    smartphoneHorizontalResolution: {
      type: Number,
      required: [true, 'Horizontal resolution is required'],
    },
    smartphoneVerticalResolution: {
      type: Number,
      required: [true, 'Vertical resolution is required'],
    },
    smartphoneRamCapacity: {
      type: Number,
      required: [true, 'RAM is required'],
    },
    smartphoneRamCapacityUnit: {
      type: String,
      required: [true, 'RAM unit is required'],
    },
    smartphoneStorage: {
      type: Number,
      required: [true, 'Storage is required'],
    },
    smartphoneBattery: {
      type: Number,
      required: [true, 'Battery is required'],
    },
    smartphoneCamera: {
      type: String,
      required: [true, 'Camera is required'],
    },
    smartphoneColor: {
      type: String,
      required: [true, 'Color is required'],
    },
  },
  {
    _id: false,
  }
);

const tabletSchema = new Schema<TabletSpecifications>(
  {
    tabletOs: {
      type: String,
      required: [true, 'OS is required'],
    },
    tabletChipset: {
      type: String,
      required: [true, 'Chipset is required'],
    },
    tabletDisplay: {
      type: Number,
      required: [true, 'Display is required'],
    },
    tabletHorizontalResolution: {
      type: Number,
      required: [true, 'Horizontal resolution is required'],
    },
    tabletVerticalResolution: {
      type: Number,
      required: [true, 'Vertical resolution is required'],
    },
    tabletRamCapacity: {
      type: Number,
      required: [true, 'RAM is required'],
    },
    tabletRamCapacityUnit: {
      type: String,
      required: [true, 'RAM unit is required'],
    },
    tabletStorage: {
      type: Number,
      required: [true, 'Storage is required'],
    },
    tabletBattery: {
      type: Number,
      required: [true, 'Battery is required'],
    },
    tabletCamera: {
      type: String,
      required: [true, 'Camera is required'],
    },
    tabletColor: {
      type: String,
      required: [true, 'Color is required'],
    },
  },
  {
    _id: false,
  }
);

const accessorySchema = new Schema<AccessorySpecifications>(
  {
    accessoryType: {
      type: String,
      required: [true, 'Type is required'],
    },
    accessoryColor: {
      type: String,
      required: [true, 'Color is required'],
    },
    accessoryInterface: {
      type: String,
      required: [true, 'Interface is required'],
    },
    // user defined fields
    userDefinedFields: {
      type: Object,
      required: false,
    },
  },
  {
    _id: false,
  }
);

const desktopComputerSchema = new Schema<DesktopComputerSpecifications>(
  {
    cpu: {
      type: cpuSchema,
      required: false,
      default: {},
    },
    gpu: {
      type: gpuSchema,
      required: false,
      default: {},
    },
    motherboard: {
      type: motherboardSchema,
      required: false,
      default: {},
    },
    ram: {
      type: ramSchema,
      required: false,
      default: {},
    },
    storage: {
      type: storageSchema,
      required: false,
      default: {},
    },
    psu: {
      type: psuSchema,
      required: false,
      default: {},
    },
    case: {
      type: caseSchema,
      required: false,
      default: {},
    },
    monitor: {
      type: monitorSchema,
      required: false,
      default: {},
    },
    keyboard: {
      type: keyboardSchema,
      required: false,
      default: {},
    },
    mouse: {
      type: mouseSchema,
      required: false,
      default: {},
    },
    speaker: {
      type: speakerSchema,
      required: false,
      default: {},
    },
  },
  {
    _id: false,
  }
);

const laptopSchema = new Schema<LaptopSpecifications>(
  {
    cpu: {
      type: cpuSchema,
      required: false,
      default: {},
    },
    gpu: {
      type: gpuSchema,
      required: false,
      default: {},
    },
    ram: {
      type: ramSchema,
      required: false,
      default: {},
    },
    storage: {
      type: storageSchema,
      required: false,
      default: {},
    },
    display: {
      type: monitorSchema,
      required: false,
      default: {},
    },
  },
  {
    _id: false,
  }
);

const productSchema = new Schema<ProductSchema>(
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
    action: {
      type: String,
      required: [true, 'Action is required'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      index: true,
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
    productCategory: {
      type: String,
      required: [true, 'Product category is required'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: String,
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
    specifications: {
      type: {
        //  desktop computer
        desktopComputer: {
          type: desktopComputerSchema,
          required: false,
        },

        // laptop
        laptop: {
          type: laptopSchema,
          required: false,
        },

        // cpu
        cpu: {
          type: cpuSchema,
          required: false,
        },

        // gpu
        gpu: {
          type: gpuSchema,
          required: false,
        },

        // motherboard
        motherboard: {
          type: motherboardSchema,
          required: false,
        },

        // ram
        ram: {
          type: ramSchema,
          required: false,
        },

        // storage
        storage: {
          type: storageSchema,
          required: false,
        },

        // psu
        psu: {
          type: psuSchema,
          required: false,
        },

        // case
        case: {
          type: caseSchema,
          required: false,
        },

        // monitor
        monitor: {
          type: monitorSchema,
          required: false,
        },

        // keyboard
        keyboard: {
          type: keyboardSchema,
          required: false,
        },

        // mouse
        mouse: {
          type: mouseSchema,
          required: false,
        },

        // headphone
        headphone: {
          type: headphoneSchema,
          required: false,
        },

        // speaker
        speaker: {
          type: speakerSchema,
          required: false,
        },

        // smartphone
        smartphone: {
          type: smartphoneSchema,
          required: false,
        },

        // tablet
        tablet: {
          type: tabletSchema,
          required: false,
        },

        // accessory
        accessory: {
          type: accessorySchema,
          required: false,
        },
      },
      required: false,
      default: {},
      _id: false,
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
  {
    timestamps: true,
  }
);

// text index for searching all fields that are of type string
productSchema.index({
  // cpu
  'specifications.cpu.socket': 'text',
  'specifications.cpu.speed': 'text',
  'specifications.cpu.l1Cache': 'text',
  'specifications.cpu.l2Cache': 'text',
  'specifications.cpu.l3Cache': 'text',
  'specifications.cpu.wattage': 'text',
  // gpu
  'specifications.gpu.chipset': 'text',
  'specifications.gpu.memory': 'text',
  'specifications.gpu.coreClock': 'text',
  'specifications.gpu.boostClock': 'text',
  'specifications.gpu.tdp': 'text',
  // motherboard
  'specifications.motherboard.socket': 'text',
  'specifications.motherboard.chipset': 'text',
  'specifications.motherboard.memoryMax': 'text',

  // ram
  'specifications.ram.speed': 'text',
  'specifications.ram.modules': 'text',
  'specifications.ram.voltage': 'text',
  'specifications.ram.timing': 'text',
  // storage
  'specifications.storage.capacity': 'text',
  'specifications.storage.cache': 'text',
  // psu
  'specifications.psu.wattage': 'text',
  // monitor
  'specifications.monitor.size': 'text',
  'specifications.monitor.resolution': 'text',
  'specifications.monitor.refreshRate': 'text',
  'specifications.monitor.responseTime': 'text',
  'specifications.monitor.aspectRatio': 'text',
  // mouse
  'specifications.mouse.dpi': 'text',
  'specifications.mouse.buttons': 'text',
  // headphone
  'specifications.headphone.driver': 'text',
  'specifications.headphone.frequencyResponse': 'text',
  'specifications.headphone.impedance': 'text',
  // speaker
  'specifications.speaker.totalWattage': 'text',
  'specifications.speaker.frequencyResponse': 'text',
  // smartphone
  'specifications.smartphone.os': 'text',
  'specifications.smartphone.chipset': 'text',
  'specifications.smartphone.display': 'text',
  'specifications.smartphone.resolution': 'text',
  'specifications.smartphone.ram': 'text',
  'specifications.smartphone.storage': 'text',
  'specifications.smartphone.battery': 'text',
  'specifications.smartphone.camera': 'text',
  // tablet
  'specifications.tablet.os': 'text',
  'specifications.tablet.chipset': 'text',
  'specifications.tablet.display': 'text',
  'specifications.tablet.resolution': 'text',
  'specifications.tablet.ram': 'text',
  'specifications.tablet.storage': 'text',
  'specifications.tablet.battery': 'text',
  'specifications.tablet.camera': 'text',
  // accessory
  'specifications.accessory.type': 'text',
  // product
  brand: 'text',
  model: 'text',
  price: 'text',
  description: 'text',
  additionalComments: 'text',
  weight: 'text',
  // dimensions
  'dimensions.length': 'text',
  'dimensions.width': 'text',
  'dimensions.height': 'text',
  // reviews
  'reviews.username': 'text',
  'reviews.review': 'text',
});

const ProductModel = model<ProductDocument>('Products', productSchema);

export { ProductModel };
export type {
  ProductSchema,
  ProductDocument,
  ProductCategory,
  CpuSpecifications,
  GpuSpecifications,
  MotherboardSpecifications,
  RamSpecifications,
  MemoryType,
  StorageType,
  StorageFormFactor,
  StorageInterface,
  StorageSpecifications,
  PsuEfficiency,
  PsuModularity,
  PsuSpecifications,
  CaseType,
  CaseSidePanel,
  CaseSpecifications,
  MonitorPanelType,
  MonitorSpecifications,
  KeyboardSwitch,
  KeyboardLayout,
  KeyboardBacklight,
  PeripheralsInterface,
  KeyboardSpecifications,
  MouseSensor,
  MouseSpecifications,
  HeadphoneType,
  HeadphoneInterface,
  HeadphoneSpecifications,
  SpeakerType,
  SpeakerInterface,
  SpeakerSpecifications,
  SmartphoneSpecifications,
  TabletSpecifications,
  AccessorySpecifications,
  Specifications,
  DimensionUnit,
  WeightUnit,
  ProductReview,
  ProductAvailability,
};
