import { Schema, Types, model } from 'mongoose';

import type {
  DimensionUnit,
  DisplayPanelType,
  ProductAvailability,
  ProductReview,
  WeightUnit,
} from '../types';
import type { Currency } from '../../../company/expenseClaim';

type DisplaySchema = {
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
  displaySize: number; // 24", 27", etc.
  displayHorizontalResolution: number;
  displayVerticalResolution: number;
  displayRefreshRate: number; // 144 Hz, 165 Hz, etc.
  displayPanelType: DisplayPanelType; // IPS, TN, etc.
  displayResponseTime: number; // 1 ms, 4 ms, etc.
  displayAspectRatio: string; // 16:9, 21:9, etc.
  additionalFields: {
    [key: string]: string;
  };

  // page 3
  reviews: ProductReview[];
  uploadedFilesIds: Types.ObjectId[];
};

type DisplayDocument = DisplaySchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const displaySchema = new Schema<DisplaySchema>(
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
displaySchema.index({
  brand: 'text',
  model: 'text',
  description: 'text',
  additionalComments: 'text',
  // reviews
  'reviews.username': 'text',
  'reviews.review': 'text',
  // display
  displayAspectRatio: 'text',
});

const DisplayModel = model<DisplayDocument>('Display', displaySchema);

export { DisplayModel };
export type { DisplayDocument, DisplaySchema, DisplayPanelType };
