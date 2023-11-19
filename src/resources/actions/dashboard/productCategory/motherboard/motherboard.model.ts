import { Schema, Types, model } from 'mongoose';

import type {
  DimensionUnit,
  MemoryType,
  MemoryUnit,
  MotherboardFormFactor,
  ProductAvailability,
  ProductReview,
  WeightUnit,
} from '../product.types';
import type { Currency } from '../../../company/expenseClaim';

type MotherboardSchema = {
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
  additionalFields: {
    [key: string]: string;
  };

  // page 3
  reviews: ProductReview[];
  uploadedFilesIds: Types.ObjectId[];
};

type MotherboardDocument = MotherboardSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const motherboardSchema = new Schema<MotherboardSchema>(
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
    additionalFields: {
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
motherboardSchema.index({
  brand: 'text',
  model: 'text',
  description: 'text',
  additionalComments: 'text',
  // reviews
  'reviews.username': 'text',
  'reviews.review': 'text',
  // motherboard
  motherboardSocket: 'text',
  motherboardChipset: 'text',
});

const MotherboardModel = model<MotherboardDocument>('Motherboard', motherboardSchema);

export type { MotherboardDocument, MotherboardSchema, MotherboardFormFactor };
export { MotherboardModel };
