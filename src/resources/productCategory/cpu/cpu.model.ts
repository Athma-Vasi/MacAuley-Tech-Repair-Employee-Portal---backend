import { model, Schema, Types } from "mongoose";
import type {
  DimensionUnit,
  MemoryUnit,
  ProductAvailability,
  StarRatingsCount,
  WeightUnit,
} from "../productCategory.types";
import { Currency } from "../../../types";

type CpuSchema = {
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
  cpuSocket: string; // LGA 1200, AM4, etc.
  cpuFrequency: number; // 3.6 GHz, 4.2 GHz, etc.
  cpuCores: number; // 6 cores, 8 cores, etc.
  cpuL1Cache: number; // 384, 512, etc.
  cpuL1CacheUnit: MemoryUnit; // KB, etc.
  cpuL2Cache: number; // 1.5, 2, etc.
  cpuL2CacheUnit: MemoryUnit; // MB, etc.
  cpuL3Cache: number; // 12, 16, etc.
  cpuL3CacheUnit: MemoryUnit; // MB, etc.
  cpuWattage: number; // 65 W, 95 W, etc.
  additionalFields: {
    [key: string]: string;
  };

  starRatingsCount: StarRatingsCount;
  productReviewsIds: Types.ObjectId[];
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
    cpuSocket: {
      type: String,
      required: [true, "Socket is required"],
    },
    cpuFrequency: {
      type: Number,
      required: [true, "Speed is required"],
    },
    cpuCores: {
      type: Number,
      required: [true, "Cores is required"],
    },
    cpuL1Cache: {
      type: Number,
      required: [true, "Cache is required"],
    },
    cpuL1CacheUnit: {
      type: String,
      required: [true, "Cache unit is required"],
      index: true,
    },
    cpuL2Cache: {
      type: Number,
      required: [true, "Cache is required"],
    },
    cpuL2CacheUnit: {
      type: String,
      required: [true, "Cache unit is required"],
      index: true,
    },
    cpuL3Cache: {
      type: Number,
      required: [true, "Cache is required"],
    },
    cpuL3CacheUnit: {
      type: String,
      required: [true, "Cache unit is required"],
      index: true,
    },
    cpuWattage: {
      type: Number,
      required: [true, "Wattage is required"],
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
cpuSchema.index({
  brand: "text",
  model: "text",
  description: "text",
  additionalComments: "text",
  // cpu
  cpuSocket: "text",
});

const CpuModel = model<CpuDocument>("CPU", cpuSchema);

export type { CpuDocument, CpuSchema };
export { CpuModel };
