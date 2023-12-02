import { Schema, Types, model } from "mongoose";
import { Currency } from "../actions/company/expenseClaim";
import { ProductCategory } from "../productCategory";

type RMAStatus = "Pending" | "Received" | "Cancelled";

type RMASchema = {
  purchaseDocumentId: Types.ObjectId;
  customerId: Types.ObjectId;
  productId: Types.ObjectId;
  productSku: string;
  purchasePrice: number;
  purchaseCurrency: Currency;
  productCategory: ProductCategory;
  rmaCode: string;
  rmaDate: NativeDate;
  rmaAmount: number;
  rmaCurrency: Currency;
  rmaReason: string;
  rmaStatus: RMAStatus;
};

type RMADocument = RMASchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const rmaSchema = new Schema<RMASchema>(
  {
    purchaseDocumentId: {
      type: Schema.Types.ObjectId,
      required: [true, "Purchase Document ID is required"],
      ref: "Purchase",
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: [true, "Customer ID is required"],
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: [true, "Product ID is required"],
    },
    productSku: {
      type: String,
      required: [true, "Product SKU is required"],
      index: true,
    },
    purchasePrice: {
      type: Number,
      required: [true, "Product price is required"],
    },
    purchaseCurrency: {
      type: String,
      required: [true, "Product currency is required"],
      index: true,
    },
    productCategory: {
      type: String,
      required: [true, "Product category is required"],
      index: true,
    },
    rmaCode: {
      type: String,
      required: [true, "RMA code is required"],
      index: true,
    },
    rmaDate: {
      type: Date,
      required: [true, "RMA date is required"],
    },
    rmaAmount: {
      type: Number,
      required: [true, "RMA amount is required"],
    },
    rmaCurrency: {
      type: String,
      required: [true, "RMA currency is required"],
      index: true,
    },
    rmaReason: {
      type: String,
      required: [true, "RMA reason is required"],
    },
    rmaStatus: {
      type: String,
      required: [true, "RMA status is required"],
      index: true,
    },
  },
  { timestamps: true }
);

// text indexes
rmaSchema.index({ rmaReason: "text" });

const RMAModel = model<RMADocument>("RMA", rmaSchema);

export { RMAModel };
export type { RMASchema, RMADocument, RMAStatus };
