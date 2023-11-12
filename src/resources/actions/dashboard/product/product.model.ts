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

type ColorVariant = 'Black' | 'White' | 'Silver' | 'Gold' | 'Space Gray' | 'Blue' | 'Green' | 'Red';

type CpuSpecifications = {
  socket: string; // LGA 1200, AM4, etc.
  speed: string; // 3.6 GHz, 4.2 GHz, etc.
  cores: string; // 6 cores, 8 cores, etc.
  cache: string; // 12 MB, 16 MB, etc.
  wattage: string; // 65 W, 95 W, etc.
};

type GpuSpecifications = {
  chipset: string; // NVIDIA GeForce RTX 3080, AMD Radeon RX 6800 XT, etc.
  memory: string; // 10 GB, 16 GB, etc.
  coreClock: string; // 1440 MHz, 1770 MHz, etc.
  boostClock: string; // 1710 MHz, 2250 MHz, etc.
  tdp: string; // 320 W, 350 W, etc.
};

type MotherboardSpecifications = {
  socket: string; // LGA 1200, AM4, etc.
  chipset: string; // Intel Z490, AMD B550, etc.
  formFactor: string; // ATX, Micro ATX, etc.
  memoryMax: string; // 128 GB, 256 GB, etc.
  memorySlots: string; // 4, 8, etc.
  memoryType: string; // DDR4, etc.
  sataPorts: string; // 6, 8, etc.
  m2Slots: string; // 2, 3, etc.
  pcie3Slots: string; // 2, 3, etc.
  pcie4Slots: string; // 1, 2, etc.
};

type RamType = 'DDR5' | 'DDR4' | 'DDR3' | 'DDR2' | 'DDR';
type RamSpecifications = {
  speed: string; // 3200 MHz, 3600 MHz, etc.
  modules: string; // 2 x 8 GB, 4 x 8 GB, etc.
  ramType: RamType; // DDR4, etc.
  color: ColorVariant; // Black, White, etc.
  voltage: string; // 1.35 V, etc.
  timing: string; // 16-18-18-38, etc.
};

type StorageType = 'SSD' | 'HDD' | 'SSHD' | 'NVMe SSD' | 'SATA SSD' | 'M.2 SSD';
type StorageFormFactor = '2.5"' | 'M.2 2280' | 'M.2 22110' | 'M.2 2242' | 'M.2 2230';
type StorageInterface = 'SATA III' | 'PCIe 3.0 x4' | 'PCIe 4.0 x4' | 'PCIe 3.0 x2' | 'PCIe 3.0 x1';
type StorageSpecifications = {
  storageType: StorageType; // SSD, HDD, etc.
  capacity: string; // 1 TB, 2 TB, etc.
  cache: string; // 64 MB, 128 MB, etc.
  formFactor: StorageFormFactor; // 2.5", M.2 2280, etc.
  interface: StorageInterface; // SATA III, PCIe 3.0 x4, etc.
};

type PsuEfficiency = '80+ Bronze' | '80+ Gold' | '80+ Platinum' | '80+ Titanium';
type PsuModular = 'Full' | 'Semi' | 'None';
type PsuSpecifications = {
  wattage: string; // 650 W, 750 W, etc.
  efficiency: PsuEfficiency; // 80+ Gold, 80+ Platinum, etc.
  modular: PsuModular; // Full, Semi, etc.
};

type CaseType = 'Mid Tower' | 'Full Tower' | 'Mini Tower' | 'Cube' | 'Slim' | 'Desktop';
type CaseSidePanel = 'Windowed' | 'Solid';
type CaseSpecifications = {
  caseType: CaseType; // Mid Tower, Full Tower, etc.
  color: ColorVariant; // Black, White, etc.
  sidePanel: CaseSidePanel; // windowed or not
};

type MonitorPanelType = 'IPS' | 'TN' | 'VA';
type MonitorSpecifications = {
  size: string; // 24", 27", etc.
  resolution: string; // 1920 x 1080, 2560 x 1440, etc.
  refreshRate: string; // 144 Hz, 165 Hz, etc.
  panelType: MonitorPanelType; // IPS, TN, etc.
  responseTime: string; // 1 ms, 4 ms, etc.
  aspectRatio: string; // 16:9, 21:9, etc.
};

type KeyboardSwitch =
  | 'Cherry MX Red'
  | 'Cherry MX Blue'
  | 'Cherry MX Brown'
  | 'Cherry MX Speed'
  | 'Cherry MX Black'
  | 'Membrane';
type KeyboardLayout = 'ANSI' | 'ISO';
type KeyboardBacklight = 'RGB' | 'Single Color';
type PeripheralsInterface = 'USB' | 'Bluetooth';
type KeyboardSpecifications = {
  switch: KeyboardSwitch; // Cherry MX Red, Cherry MX Blue, etc.
  layout: KeyboardLayout; // ANSI, ISO, etc.
  backlight: KeyboardBacklight; // RGB, etc.
  interface: PeripheralsInterface; // USB, Bluetooth, etc.
};

type MouseSensor = 'Optical' | 'Laser' | 'Infrared';
type MouseSpecifications = {
  sensor: MouseSensor; // Optical, Laser, etc.
  dpi: string; // 800, 1600, etc.
  buttons: string; // 6, 8, etc.
  color: ColorVariant; // Black, White, etc.
  interface: PeripheralsInterface; // USB, Bluetooth, etc.
};

type HeadphoneType = 'Over-ear' | 'On-ear' | 'In-ear';
type HeadphoneInterface = 'USB' | 'Bluetooth' | '3.5 mm' | '2.5 mm';
type HeadphoneSpecifications = {
  type: HeadphoneType; // Over-ear, On-ear, etc.
  driver: string; // 50 mm, 53 mm, etc.
  frequencyResponse: string; // 20 Hz - 20 kHz, etc.
  impedance: string; // 32 Ohm, 64 Ohm, etc.
  color: ColorVariant; // Black, White, etc.
  interface: HeadphoneInterface; // USB, Bluetooth, etc.
};

type SpeakerType = '2.0' | '2.1' | '5.1' | '7.1';
type SpeakerInterface = HeadphoneInterface;
type SpeakerSpecifications = {
  type: SpeakerType; // 2.0, 2.1, etc.
  totalWattage: string; // 10 W, 20 W, etc.
  frequencyResponse: string; // 20 Hz - 20 kHz, etc.
  color: ColorVariant; // Black, White, etc.
  interface: SpeakerInterface; // USB, Bluetooth, etc.
};

type SmartphoneSpecifications = {
  os: string; // Android, iOS, etc.
  chipset: string; // Snapdragon 888, Apple A14 Bionic, etc.
  display: string; // 6.7", 6.9", etc.
  resolution: string; // 1440 x 3200, 1170 x 2532, etc.
  ram: string; // 12 GB, 16 GB, etc.
  storage: string; // 128 GB, 256 GB, etc.
  battery: string; // 5000 mAh, 6000 mAh, etc.
  camera: string; // 108 MP, 64 MP, etc.
  color: ColorVariant; // Black, White, etc.
};

type TabletSpecifications = SmartphoneSpecifications;

type AccessorySpecifications = {
  type: string; // Headphones, Speakers, etc.
  color: ColorVariant; // Black, White, etc.
  interface: PeripheralsInterface; // USB, Bluetooth, etc.
};

type Specifications = {
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

type ProductDimensions = {
  length: string;
  width: string;
  height: string;
};

type ProductReview = {
  userId: Types.ObjectId;
  username: string;
  rating: number;
  review: string;
};

type ProductSchema = {
  userId: Types.ObjectId;
  username: string;
  action: Action;
  category: ActionsDashboard;

  // page 1
  brand: string;
  model: string;
  productCategory: ProductCategory;
  description: string;
  price: number;
  currency: Currency;
  availability: boolean;
  quantity: number;
  weight: string;
  dimensions: ProductDimensions;
  additionalComments: string;

  // page 2
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
      type: Number,
      required: [true, 'Price is required'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      index: true,
    },
    availability: {
      type: Boolean,
      required: [true, 'Availability is required'],
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    weight: {
      type: String,
      required: [true, 'Weight is required'],
    },
    dimensions: {
      type: {
        length: {
          type: String,
          required: [true, 'Length is required'],
        },
        width: {
          type: String,
          required: [true, 'Width is required'],
        },
        height: {
          type: String,
          required: [true, 'Height is required'],
        },
      },
      required: [true, 'Dimensions is required'],
    },
    additionalComments: {
      type: String,
      required: false,
      default: '',
    },

    // page 2
    specifications: {
      type: {
        cpu: {
          type: {
            socket: {
              type: String,
              required: [true, 'Socket is required'],
            },
            speed: {
              type: String,
              required: [true, 'Speed is required'],
            },
            cores: {
              type: String,
              required: [true, 'Cores is required'],
            },
            cache: {
              type: String,
              required: [true, 'Cache is required'],
            },
            wattage: {
              type: String,
              required: [true, 'Wattage is required'],
            },
          },
          required: false,
          default: {},
        },
        gpu: {
          type: {
            chipset: {
              type: String,
              required: [true, 'Chipset is required'],
            },
            memory: {
              type: String,
              required: [true, 'Memory is required'],
            },
            coreClock: {
              type: String,
              required: [true, 'Core clock is required'],
            },
            boostClock: {
              type: String,
              required: [true, 'Boost clock is required'],
            },
            tdp: {
              type: String,
              required: [true, 'TDP is required'],
            },
          },
          required: false,
          default: {},
        },
        motherboard: {
          type: {
            socket: {
              type: String,
              required: [true, 'Socket is required'],
            },
            chipset: {
              type: String,
              required: [true, 'Chipset is required'],
            },
            formFactor: {
              type: String,
              required: [true, 'Form factor is required'],
            },
            memoryMax: {
              type: String,
              required: [true, 'Memory max is required'],
            },
            memorySlots: {
              type: String,
              required: [true, 'Memory slots is required'],
            },
            memoryType: {
              type: String,
              required: [true, 'Memory type is required'],
            },
            sataPorts: {
              type: String,
              required: [true, 'SATA ports is required'],
            },
            m2Slots: {
              type: String,
              required: [true, 'M.2 slots is required'],
            },
            pcie3Slots: {
              type: String,
              required: [true, 'PCIe 3.0 slots is required'],
            },
            pcie4Slots: {
              type: String,
              required: [true, 'PCIe 4.0 slots is required'],
            },
          },
          required: false,
          default: {},
        },

        ram: {
          type: {
            speed: {
              type: String,
              required: [true, 'Speed is required'],
            },
            modules: {
              type: String,
              required: [true, 'Modules is required'],
            },
            ramType: {
              type: String,
              required: [true, 'RAM type is required'],
              index: true,
            },
            color: {
              type: String,
              required: [true, 'Color is required'],
              index: true,
            },
            voltage: {
              type: String,
              required: [true, 'Voltage is required'],
            },
            timing: {
              type: String,
              required: [true, 'Timing is required'],
            },
          },
          required: false,
          default: {},
        },

        storage: {
          type: {
            storageType: {
              type: String,
              required: [true, 'Storage type is required'],
              index: true,
            },
            capacity: {
              type: String,
              required: [true, 'Capacity is required'],
            },
            cache: {
              type: String,
              required: [true, 'Cache is required'],
            },
            formFactor: {
              type: String,
              required: [true, 'Form factor is required'],
              index: true,
            },
            interface: {
              type: String,
              required: [true, 'Interface is required'],
              index: true,
            },
          },
          required: false,
          default: {},
        },

        psu: {
          type: {
            wattage: {
              type: String,
              required: [true, 'Wattage is required'],
            },
            efficiency: {
              type: String,
              required: [true, 'Efficiency is required'],
              index: true,
            },
            modular: {
              type: String,
              required: [true, 'Modular is required'],
              index: true,
            },
          },
          required: false,
          default: {},
        },

        case: {
          type: {
            caseType: {
              type: String,
              required: [true, 'Case type is required'],
              index: true,
            },
            color: {
              type: String,
              required: [true, 'Color is required'],
              index: true,
            },
            sidePanel: {
              type: String,
              required: [true, 'Side panel is required'],
              index: true,
            },
          },
          required: false,
          default: {},
        },

        monitor: {
          type: {
            size: {
              type: String,
              required: [true, 'Size is required'],
            },
            resolution: {
              type: String,
              required: [true, 'Resolution is required'],
            },
            refreshRate: {
              type: String,
              required: [true, 'Refresh rate is required'],
            },
            panelType: {
              type: String,
              required: [true, 'Panel type is required'],
              index: true,
            },
            responseTime: {
              type: String,
              required: [true, 'Response time is required'],
            },
            aspectRatio: {
              type: String,
              required: [true, 'Aspect ratio is required'],
            },
          },
          required: false,
          default: {},
        },

        keyboard: {
          type: {
            switch: {
              type: String,
              required: [true, 'Switch is required'],
              index: true,
            },
            layout: {
              type: String,
              required: [true, 'Layout is required'],
              index: true,
            },
            backlight: {
              type: String,
              required: [true, 'Backlight is required'],
              index: true,
            },
            interface: {
              type: String,
              required: [true, 'Interface is required'],
              index: true,
            },
          },
          required: false,
          default: {},
        },

        mouse: {
          type: {
            sensor: {
              type: String,
              required: [true, 'Sensor is required'],
              index: true,
            },
            dpi: {
              type: String,
              required: [true, 'DPI is required'],
            },
            buttons: {
              type: String,
              required: [true, 'Buttons is required'],
            },
            color: {
              type: String,
              required: [true, 'Color is required'],
              index: true,
            },
            interface: {
              type: String,
              required: [true, 'Interface is required'],
            },
          },
          required: false,
          default: {},
        },

        headphone: {
          type: {
            type: {
              type: String,
              required: [true, 'Type is required'],
              index: true,
            },
            driver: {
              type: String,
              required: [true, 'Driver is required'],
            },
            frequencyResponse: {
              type: String,
              required: [true, 'Frequency response is required'],
            },
            impedance: {
              type: String,
              required: [true, 'Impedance is required'],
            },
            color: {
              type: String,
              required: [true, 'Color is required'],
              index: true,
            },
            interface: {
              type: String,
              required: [true, 'Interface is required'],
              index: true,
            },
          },
          required: false,
          default: {},
        },

        speaker: {
          type: {
            type: {
              type: String,
              required: [true, 'Type is required'],
              index: true,
            },
            totalWattage: {
              type: String,
              required: [true, 'Total wattage is required'],
            },
            frequencyResponse: {
              type: String,
              required: [true, 'Frequency response is required'],
            },
            color: {
              type: String,
              required: [true, 'Color is required'],
              index: true,
            },
            interface: {
              type: String,
              required: [true, 'Interface is required'],
              index: true,
            },
          },
          required: false,
          default: {},
        },

        smartphone: {
          type: {
            os: {
              type: String,
              required: [true, 'OS is required'],
            },
            chipset: {
              type: String,
              required: [true, 'Chipset is required'],
            },
            display: {
              type: String,
              required: [true, 'Display is required'],
            },
            resolution: {
              type: String,
              required: [true, 'Resolution is required'],
            },
            ram: {
              type: String,
              required: [true, 'RAM is required'],
            },
            storage: {
              type: String,
              required: [true, 'Storage is required'],
            },
            battery: {
              type: String,
              required: [true, 'Battery is required'],
            },
            camera: {
              type: String,
              required: [true, 'Camera is required'],
            },
            color: {
              type: String,
              required: [true, 'Color is required'],
            },
          },
          required: false,
          default: {},
        },

        tablet: {
          type: {
            os: {
              type: String,
              required: [true, 'OS is required'],
            },
            chipset: {
              type: String,
              required: [true, 'Chipset is required'],
            },
            display: {
              type: String,
              required: [true, 'Display is required'],
            },
            resolution: {
              type: String,
              required: [true, 'Resolution is required'],
            },
            ram: {
              type: String,
              required: [true, 'RAM is required'],
            },
            storage: {
              type: String,
              required: [true, 'Storage is required'],
            },
            battery: {
              type: String,
              required: [true, 'Battery is required'],
            },
            camera: {
              type: String,
              required: [true, 'Camera is required'],
            },
            color: {
              type: String,
              required: [true, 'Color is required'],
            },
          },
          required: false,
          default: {},
        },

        accessory: {
          type: {
            type: {
              type: String,
              required: [true, 'Type is required'],
            },
            color: {
              type: String,
              required: [true, 'Color is required'],
              index: true,
            },
            interface: {
              type: String,
              required: [true, 'Interface is required'],
              index: true,
            },
          },
          required: false,
          default: {},
        },
      },
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
  {
    timestamps: true,
  }
);

// text index for searching all fields that are of type string
productSchema.index({
  // cpu
  'specifications.cpu.socket': 'text',
  'specifications.cpu.speed': 'text',
  'specifications.cpu.cores': 'text',
  'specifications.cpu.cache': 'text',
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
  'specifications.motherboard.formFactor': 'text',
  'specifications.motherboard.memoryMax': 'text',
  'specifications.motherboard.memorySlots': 'text',
  'specifications.motherboard.memoryType': 'text',
  'specifications.motherboard.sataPorts': 'text',
  'specifications.motherboard.m2Slots': 'text',
  'specifications.motherboard.pcie3Slots': 'text',
  'specifications.motherboard.pcie4Slots': 'text',
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
  ColorVariant,
  CpuSpecifications,
  GpuSpecifications,
  MotherboardSpecifications,
  RamSpecifications,
  RamType,
  StorageType,
  StorageFormFactor,
  StorageInterface,
  StorageSpecifications,
  PsuEfficiency,
  PsuModular,
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
  ProductDimensions,
  ProductReview,
};
