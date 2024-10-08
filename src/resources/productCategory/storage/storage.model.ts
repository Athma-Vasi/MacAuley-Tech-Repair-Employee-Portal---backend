import { model, Schema, Types } from "mongoose";

import type {
  DimensionUnit,
  MemoryUnit,
  ProductAvailability,
  ProductReview,
  StarRatingsCount,
  StorageFormFactor,
  StorageInterface,
  StorageType,
  WeightUnit,
} from "../productCategory.types";
import { Currency } from "../../../types";

type StorageSchema = {
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

  starRatingsCount: StarRatingsCount;
  productReviewsIds: Types.ObjectId[];
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
    storageType: {
      type: String,
      required: [true, "Storage type is required"],
      index: true,
    },
    storageCapacity: {
      type: Number,
      required: [true, "Capacity is required"],
    },
    storageCapacityUnit: {
      type: String,
      required: [true, "Capacity unit is required"],
    },
    storageCache: {
      type: Number,
      required: [true, "Cache is required"],
    },
    storageCacheUnit: {
      type: String,
      required: [true, "Cache unit is required"],
      index: true,
    },
    storageFormFactor: {
      type: String,
      required: [true, "Form factor is required"],
      index: true,
    },
    storageInterface: {
      type: String,
      required: [true, "Interface is required"],
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
storageSchema.index({
  brand: "text",
  model: "text",
  description: "text",
  additionalComments: "text",
});

const StorageModel = model<StorageDocument>("Storage", storageSchema);

export type {
  StorageDocument,
  StorageFormFactor,
  StorageInterface,
  StorageSchema,
  StorageType,
};
export { StorageModel };
