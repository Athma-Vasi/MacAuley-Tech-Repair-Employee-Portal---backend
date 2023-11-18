import { Schema, Types, model } from 'mongoose';
import type { Action } from '../../..';
import type { ActionsDashboard } from '../../dashboard.types';
import type {
  DimensionUnit,
  ProductAvailability,
  ProductCategory,
  MemoryUnit,
  ProductReview,
  WeightUnit,
} from '../types';
import type { Currency } from '../../../company/expenseClaim';

type CpuSchema = {
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
  additionalFields: {
    [key: string]: string;
  };

  // page 3
  reviews: ProductReview[];
  uploadedFilesIds: Types.ObjectId[];
};

type CpuDocument = CpuSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const cpuSchema = new Schema<CpuSchema>(
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
    // user defined fields
    additionalFields: {
      type: Object,
      required: false,
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

// text indexes for searching all fields of type string
cpuSchema.index({
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
  // cpu
  'specifications.cpu.socket': 'text',
  'specifications.cpu.speed': 'text',
  'specifications.cpu.l1Cache': 'text',
  'specifications.cpu.l2Cache': 'text',
  'specifications.cpu.l3Cache': 'text',
  'specifications.cpu.wattage': 'text',
  // reviews
  'reviews.username': 'text',
  'reviews.review': 'text',
});

const CpuModel = model<CpuDocument>('CPU', cpuSchema);

export type { CpuDocument, CpuSchema };
export { CpuModel };
