import { model, Schema, Types } from "mongoose";

import type {
  DimensionUnit,
  ProductAvailability,
  PsuEfficiency,
  PsuFormFactor,
  PsuModularity,
  StarRatingsCount,
  WeightUnit,
} from "../productCategory.types";
import { Currency } from "../../../types";

type PsuSchema = {
  // page 1
  sku: string[];
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
  psuWattage: number; // 650 W, 750 W, etc.
  psuEfficiency: PsuEfficiency; // 80+ Gold, 80+ Platinum, etc.
  psuFormFactor: PsuFormFactor; // ATX, SFX, etc.
  psuModularity: PsuModularity; // Full, Semi, etc.
  additionalFields: {
    [key: string]: string;
  };

  starRatingsCount: StarRatingsCount;
  productReviewsIds: Types.ObjectId[];
  uploadedFilesIds: Types.ObjectId[];
};

type PsuDocument = PsuSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const psuSchema = new Schema<PsuSchema>(
  {
    // page 1
    sku: {
      type: [String],
      required: false,
      default: [],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
    },
    model: {
      type: String,
      required: [true, "Model is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      index: true,
    },
    availability: {
      type: String,
      required: [true, "Availability is required"],
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
    },
    weightUnit: {
      type: String,
      required: [true, "Weight unit is required"],
      index: true,
    },
    length: {
      type: Number,
      required: [true, "Length is required"],
    },
    lengthUnit: {
      type: String,
      required: [true, "Length unit is required"],
      index: true,
    },
    width: {
      type: Number,
      required: [true, "Width is required"],
    },
    widthUnit: {
      type: String,
      required: [true, "Width unit is required"],
      index: true,
    },
    height: {
      type: Number,
      required: [true, "Height is required"],
    },
    heightUnit: {
      type: String,
      required: [true, "Height unit is required"],
      index: true,
    },
    additionalComments: {
      type: String,
      required: false,
      default: "",
    },

    // page 2
    psuWattage: {
      type: Number,
      required: [true, "Wattage is required"],
    },
    psuEfficiency: {
      type: String,
      required: [true, "Efficiency is required"],
      index: true,
    },
    psuFormFactor: {
      type: String,
      required: [true, "Form factor is required"],
      index: true,
    },
    psuModularity: {
      type: String,
      required: [true, "Modular is required"],
      index: true,
    },
    // user defined fields
    additionalFields: {
      type: Object,
      required: false,
      default: {},
    },

    starRatingsCount: {
      type: Object,
      required: false,
      default: {
        halfStar: 0,
        oneStar: 0,
        oneAndHalfStars: 0,
        twoStars: 0,
        twoAndHalfStars: 0,
        threeStars: 0,
        threeAndHalfStars: 0,
        fourStars: 0,
        fourAndHalfStars: 0,
        fiveStars: 0,
      },
    },
    productReviewsIds: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: [],
      ref: "Review",
      index: true,
    },
    uploadedFilesIds: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: [],
      ref: "FileUpload",
      index: true,
    },
  },
  { timestamps: true },
);

// text indexes for searching all user entered text input fields
psuSchema.index({
  brand: "text",
  model: "text",
  description: "text",
  additionalComments: "text",
});

const PsuModel = model<PsuDocument>("Psu", psuSchema);

export type {
  PsuDocument,
  PsuEfficiency,
  PsuFormFactor,
  PsuModularity,
  PsuSchema,
};
export { PsuModel };
