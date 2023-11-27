import { Schema, Types, model } from 'mongoose';
import { Currency } from '../../actions/company/expenseClaim';
import { Address, StoreLocation } from '../../user/user.model';
import { PaymentInformation } from '../../customer/customer.model';

type LocationKind = 'In-Store' | 'Online';
type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Returned' | 'Cancelled' | '';

type PurchaseInStoreSchema = {
  productId: Types.ObjectId;
  productSku: string;
  productBrand: string;
  productModel: string;

  dateOfPurchase: NativeDate;
  purchaseAmount: number;
  purchaseCurrency: Currency;
  purchaseStoreLocation: StoreLocation;

  customerId: Types.ObjectId;
  paymentInformation: PaymentInformation;
};

type PurchaseInStoreDocument = PurchaseInStoreSchema & {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
  __v: number;
};

const purchaseInStoreSchema = new Schema<PurchaseInStoreSchema>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Product ID is required'],
    },
    productSku: {
      type: String,
      required: [true, 'Product SKU is required'],
    },
    productBrand: {
      type: String,
      required: [true, 'Product Brand is required'],
    },
    productModel: {
      type: String,
      required: [true, 'Product Model is required'],
    },

    dateOfPurchase: {
      type: Date,
      required: [true, 'Date of Purchase is required'],
      index: true,
    },
    purchaseAmount: {
      type: Number,
      required: [true, 'Purchase Amount is required'],
    },
    purchaseCurrency: {
      type: String,
      required: [true, 'Purchase Currency is required'],
      index: true,
    },
    purchaseStoreLocation: {
      type: String,
      required: [true, 'Purchase Store Location is required'],
      index: true,
    },

    customerId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Customer ID is required'],
      ref: 'Customer',
    },

    paymentInformation: {
      cardholderName: {
        type: String,
        required: [true, 'Cardholder name is required'],
      },
      cardNumber: {
        type: String,
        required: [true, 'Card number is required'],
      },
      expirationDate: {
        type: String,
        required: [true, 'Expiration date is required'],
      },
      cvv: {
        type: String,
        required: [true, 'CVV is required'],
      },
      billingAddress: {
        addressLine: {
          type: String,
          required: [true, 'Address line 1 is required'],
        },
        city: {
          type: String,
          required: [true, 'City is required'],
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
          required: [true, 'Postal code is required'],
        },
        country: {
          type: String,
          required: [true, 'Country is required'],
          index: true,
        },
      },
    },
  },
  { timestamps: true }
);

// text indexes for searching all user entered text input fields
purchaseInStoreSchema.index({
  productSku: 'text',
  productBrand: 'text',
  productModel: 'text',
  'paymentInformation.cardholderName': 'text',
  'paymentInformation.billingAddress.addressLine': 'text',
  'paymentInformation.billingAddress.city': 'text',
  'paymentInformation.billingAddress.postalCode': 'text',
});

const PurchaseInStoreModel = model<PurchaseInStoreDocument>(
  'PurchaseInStore',
  purchaseInStoreSchema
);

export { PurchaseInStoreModel };
export type { PurchaseInStoreSchema, PurchaseInStoreDocument };
