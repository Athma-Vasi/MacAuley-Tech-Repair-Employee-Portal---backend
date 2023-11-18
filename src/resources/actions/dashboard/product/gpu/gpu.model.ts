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

type GpuSchema = {
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
  gpuChipset: string; // NVIDIA GeForce RTX 3080,
  gpuMemory: number; // 10 GB, 16 GB, etc.
  gpuMemoryUnit: MemoryUnit; // GB, etc.
  gpuCoreClock: number; // 1440 MHz, 1770 MHz, etc.
  gpuBoostClock: number; // 1710 MHz, 2250 MHz, etc.
  gpuTdp: number; // 320 W, 350 W, etc.
  additionalFields: {
    [key: string]: string;
  };

  // page 3
  reviews: ProductReview[];
  uploadedFilesIds: Types.ObjectId[];
};

type GpuDocument = GpuSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const gpuSchema = new Schema<GpuSchema>(
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
gpuSchema.index({
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
  // gpu
  'specifications.gpu.chipset': 'text',
  'specifications.gpu.memory': 'text',
  'specifications.gpu.coreClock': 'text',
  'specifications.gpu.boostClock': 'text',
  'specifications.gpu.tdp': 'text',
  // reviews
  'reviews.username': 'text',
  'reviews.review': 'text',
});

const GpuModel = model<GpuDocument>('GPU', gpuSchema);

export type { GpuDocument, GpuSchema };
export { GpuModel };
