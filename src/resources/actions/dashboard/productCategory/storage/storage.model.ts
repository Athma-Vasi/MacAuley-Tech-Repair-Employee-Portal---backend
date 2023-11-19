import { Schema, Types, model } from 'mongoose';

import type {
  DimensionUnit,
  MemoryUnit,
  ProductAvailability,
  ProductReview,
  StorageFormFactor,
  StorageInterface,
  StorageType,
  WeightUnit,
} from '../types';
import type { Currency } from '../../../company/expenseClaim';

type StorageSchema = {
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
  storageType: StorageType; // SSD, HDD, etc.
  storageCapacity: number; // 1, 2, etc.
  storageCapacityUnit: MemoryUnit; // TB, etc.
  storageCache: number; // 64 MB, 128 MB, etc.
  storageCacheUnit: MemoryUnit; // MB, etc.
  storageFormFactor: StorageFormFactor; // 2.5", M.2 2280, etc.
  storageInterface: StorageInterface; // SATA III, PCIe 3.0 x4, etc.
  additionalFields: {
    [key: string]: string;
  };

  // page 3
  reviews: ProductReview[];
  uploadedFilesIds: Types.ObjectId[];
};

type StorageDocument = StorageSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const storageSchema = new Schema<StorageSchema>(
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
      index: true,
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
storageSchema.index({
  brand: 'text',
  model: 'text',
  description: 'text',
  additionalComments: 'text',
  // reviews
  'reviews.username': 'text',
  'reviews.review': 'text',
});

const StorageModel = model<StorageDocument>('Storage', storageSchema);

export type { StorageDocument, StorageSchema, StorageType, StorageFormFactor, StorageInterface };
export { StorageModel };
