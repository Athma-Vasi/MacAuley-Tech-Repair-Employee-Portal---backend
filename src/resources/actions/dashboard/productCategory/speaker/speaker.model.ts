import { Schema, Types, model } from 'mongoose';

import type {
  DimensionUnit,
  ProductAvailability,
  ProductReview,
  SpeakerInterface,
  SpeakerType,
  WeightUnit,
} from '../product.types';
import type { Currency } from '../../../company/expenseClaim';

type SpeakerSchema = {
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
  speakerType: SpeakerType; // 2.0, 2.1, etc.
  speakerTotalWattage: number; // 10 W, 20 W, etc.
  speakerFrequencyResponse: string; // 20 Hz - 20 kHz, etc.
  speakerColor: string; // Black, White, etc.
  speakerInterface: SpeakerInterface; // USB, Bluetooth, etc.
  additionalFields: {
    [key: string]: string;
  };

  // page 3
  reviews: ProductReview[];
  uploadedFilesIds: Types.ObjectId[];
};

type SpeakerDocument = SpeakerSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const speakerSchema = new Schema<SpeakerSchema>(
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
speakerSchema.index({
  brand: 'text',
  model: 'text',
  description: 'text',
  additionalComments: 'text',
  // reviews
  'reviews.username': 'text',
  'reviews.review': 'text',
  // speaker
  speakerFrequencyResponse: 'text',
  speakerColor: 'text',
});

const SpeakerModel = model<SpeakerDocument>('Speaker', speakerSchema);

export { SpeakerModel };
export type { SpeakerDocument, SpeakerSchema, SpeakerType, SpeakerInterface };
