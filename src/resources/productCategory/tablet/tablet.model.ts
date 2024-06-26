import { Schema, Types, model } from "mongoose";

import type {
  DimensionUnit,
  MemoryUnit,
  ProductAvailability,
  WeightUnit,
  MobileOs,
  StarRatingsCount,
} from "../productCategory.types";
import type { Currency } from "../../actions/company/expenseClaim";

type TabletSchema = {
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
  tabletOs: MobileOs; // Android, iOS, etc.
  tabletChipset: string; // Snapdragon 888, Apple A14 Bionic, etc.
  tabletDisplay: number; // 6.7", 6.9", etc.
  tabletHorizontalResolution: number;
  tabletVerticalResolution: number;
  tabletRamCapacity: number; // 12, 16, etc.
  tabletRamCapacityUnit: MemoryUnit; // GB, etc.
  tabletStorage: number; // 128 GB, 256 GB, etc.
  tabletBattery: number; // 5000 mAh, 6000 mAh, etc.
  tabletCamera: string; // 108 MP, 64 MP, etc.
  tabletColor: string; // Black, White, etc.
  additionalFields: {
    [key: string]: string;
  };

  starRatingsCount: StarRatingsCount;
  productReviewsIds: Types.ObjectId[];
  uploadedFilesIds: Types.ObjectId[];
};

type TabletDocument = TabletSchema & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const tabletSchema = new Schema<TabletSchema>(
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
    tabletOs: {
      type: String,
      required: [true, "OS is required"],
      index: true,
    },
    tabletChipset: {
      type: String,
      required: [true, "Chipset is required"],
    },
    tabletDisplay: {
      type: Number,
      required: [true, "Display is required"],
    },
    tabletHorizontalResolution: {
      type: Number,
      required: [true, "Horizontal resolution is required"],
    },
    tabletVerticalResolution: {
      type: Number,
      required: [true, "Vertical resolution is required"],
    },
    tabletRamCapacity: {
      type: Number,
      required: [true, "RAM is required"],
    },
    tabletRamCapacityUnit: {
      type: String,
      required: [true, "RAM unit is required"],
      index: true,
    },
    tabletStorage: {
      type: Number,
      required: [true, "Storage is required"],
    },
    tabletBattery: {
      type: Number,
      required: [true, "Battery is required"],
    },
    tabletCamera: {
      type: String,
      required: [true, "Camera is required"],
    },
    tabletColor: {
      type: String,
      required: [true, "Color is required"],
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
  { timestamps: true }
);

// text indexes for searching all user entered text input fields
tabletSchema.index({
  brand: "text",
  model: "text",
  description: "text",
  additionalComments: "text",

  // tablet
  tabletChipset: "text",
  tabletCamera: "text",
  tabletColor: "text",
});

const TabletModel = model<TabletDocument>("Tablet", tabletSchema);

export { TabletModel };
export type { TabletSchema, TabletDocument };
