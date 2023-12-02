import { Types, Schema, model } from "mongoose";
import { Currency } from "../actions/company/expenseClaim";
import { PaymentInformation } from "../customer/customer.model";
import { Address, StoreLocation } from "../user/user.model";
import { ProductCategory } from "../productCategory";

type OrderStatus =
  | "Pending"
  | "Shipped"
  | "Delivered"
  | "Returned"
  | "Cancelled"
  | "Received";

type ProductsPurchased = {
  productId: Types.ObjectId;
  sku: string;
  quantity: number;
  price: number;
  currency: Currency;
  productCategory: ProductCategory;
  orderStatus: OrderStatus;
};

type PurchaseKind = "Online" | "In-Store";

type PurchaseSchema = {
  products: ProductsPurchased[];
  customerId: Types.ObjectId;
  dateOfPurchase: NativeDate;
  purchaseAmount: number;
  purchaseCurrency: Currency; // assume that 3rd party API will convert to CAD
  purchaseStoreLocation: StoreLocation;
  purchaseKind: PurchaseKind;
  shippingAddress: Address | null;
  paymentInformation: PaymentInformation;
};

type PurchaseDocument = PurchaseSchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const purchaseSchema = new Schema<PurchaseSchema>(
  {
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: [true, "Product ID is required"],
        },
        sku: {
          type: String,
          required: [true, "Product SKU is required"],
          index: true,
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required"],
        },
        price: {
          type: Number,
          required: [true, "Product price is required"],
        },
        currency: {
          type: String,
          required: [true, "Product currency is required"],
          index: true,
        },
        productCategory: {
          type: String,
          required: [true, "Product category is required"],
          index: true,
        },
        orderStatus: {
          type: String,
          required: [true, "Order status is required"],
          index: true,
        },
        _id: false,
      },
    ],

    customerId: {
      type: Schema.Types.ObjectId,
      required: [true, "Customer ID is required"],
      ref: "Customer",
    },

    dateOfPurchase: {
      type: Date,
      required: [true, "Date of Purchase is required"],
      index: true,
    },
    purchaseAmount: {
      type: Number,
      required: [true, "Purchase amount is required"],
    },
    purchaseCurrency: {
      type: String,
      required: [true, "Purchase currency is required"],
      index: true,
    },
    purchaseStoreLocation: {
      type: String,
      required: [true, "Purchase store location is required"],
      index: true,
    },
    purchaseKind: {
      type: String,
      required: [true, "Purchase kind is required"],
      index: true,
    },
    shippingAddress: {
      type: Schema.Types.Mixed,
      required: false,
      default: null,
    },

    paymentInformation: {
      cardholderName: {
        type: String,
        required: [true, "Cardholder name is required"],
      },
      cardNumber: {
        type: String,
        required: [true, "Card number is required"],
      },
      expirationDate: {
        type: String,
        required: [true, "Expiration date is required"],
      },
      cvv: {
        type: String,
        required: [true, "CVV is required"],
      },
      billingAddress: {
        addressLine: {
          type: String,
          required: [true, "Address line is required"],
        },
        city: {
          type: String,
          required: [true, "City is required"],
        },
        province: {
          type: String,
          required: false,
          index: true,
        },
        state: {
          type: String,
          required: false,
          index: true,
        },
        postalCode: {
          type: String,
          required: [true, "Postal code is required"],
        },
        country: {
          type: String,
          required: [true, "Country is required"],
          index: true,
        },
      },
    },
  },
  { timestamps: true }
);

// text indexes for searching all user entered text input fields
purchaseSchema.index({
  "paymentInformation.billingAddress.addressLine": "text",
  "paymentInformation.billingAddress.city": "text",
  "paymentInformation.billingAddress.postalCode": "text",
});

const PurchaseModel = model<PurchaseDocument>("Purchase", purchaseSchema);

export { PurchaseModel };
export type { PurchaseSchema, PurchaseDocument, ProductsPurchased, OrderStatus };
