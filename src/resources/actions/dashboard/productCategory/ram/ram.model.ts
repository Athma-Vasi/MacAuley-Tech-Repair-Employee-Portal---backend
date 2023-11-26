import { Schema, Types, model } from 'mongoose';

import type {
  DimensionUnit,
  MemoryType,
  MemoryUnit,
  ProductAvailability,
  ProductReview,
  WeightUnit,
} from '../product.types';
import type { Currency } from '../../../company/expenseClaim';

type RamSchema = {
  userId: Types.ObjectId;
  username: string;

  // page 1
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
  ramDataRate: number; // 3200 MT/s, 3600 MT/s, etc.
  ramModulesQuantity: number;
  ramModulesCapacity: number;
  ramModulesCapacityUnit: MemoryUnit; // GB, etc.
  ramType: MemoryType; // DDR4, etc.
  ramColor: string; // Black, White, etc.
  ramVoltage: number; // 1.35 V, etc.
  ramTiming: string; // 16-18-18-38, etc.
  additionalFields: {
    [key: string]: string;
  };

  // page 3
  reviewsIds: Types.ObjectId[];
  uploadedFilesIds: Types.ObjectId[];
};

type RamDocument = RamSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const ramSchema = new Schema<RamSchema>(
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
    additionalFields: {
      type: Object,
      required: false,
      default: {},
    },

    reviewsIds: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: [],
      ref: 'Review',
      index: true,
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
ramSchema.index({
  brand: 'text',
  model: 'text',
  description: 'text',
  additionalComments: 'text',

  // ram
  ramColor: 'text',
});

const RamModel = model<RamDocument>('RAM', ramSchema);

export type { RamDocument, RamSchema };
export { RamModel };
