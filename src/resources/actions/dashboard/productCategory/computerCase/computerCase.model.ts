import { Schema, Types, model } from 'mongoose';

import type {
  CaseSidePanel,
  CaseType,
  DimensionUnit,
  ProductAvailability,
  ProductReview,
  WeightUnit,
} from '../product.types';
import type { Currency } from '../../../company/expenseClaim';

type ComputerCaseSchema = {
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
  caseType: CaseType; // Mid Tower, Full Tower, etc.
  caseColor: string; // Black, White, etc.
  caseSidePanel: CaseSidePanel; // windowed or not
  additionalFields: {
    [key: string]: string;
  };

  // page 3
  reviewsIds: Types.ObjectId[];
  uploadedFilesIds: Types.ObjectId[];
};

type ComputerCaseDocument = ComputerCaseSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const computerCaseSchema = new Schema<ComputerCaseSchema>(
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
computerCaseSchema.index({
  brand: 'text',
  model: 'text',
  description: 'text',
  additionalComments: 'text',
  // reviews
  'reviews.username': 'text',
  'reviews.review': 'text',
  // computer case
  caseColor: 'text',
});

const ComputerCaseModel = model<ComputerCaseDocument>('ComputerCase', computerCaseSchema);

export type { ComputerCaseDocument, ComputerCaseSchema, CaseType, CaseSidePanel };
export { ComputerCaseModel };
