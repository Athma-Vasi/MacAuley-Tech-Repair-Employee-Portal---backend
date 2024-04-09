/**
 * type OrderStatus =
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
 */

import Joi from "joi";
import {
  ADDRESS_LINE_REGEX,
  CITY_REGEX,
  CURRENCY_REGEX,
  ORDER_STATUS_REGEX,
  PRODUCT_CATEGORY_REGEX,
  PURCHASE_KIND_REGEX,
  STORE_LOCATION_REGEX,
} from "../../regex";
import { PAYMENT_INFORMATION_SCHEMA } from "../customer/customer.validation";

const createPurchaseJoiSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        sku: Joi.string().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        currency: Joi.string().regex(CURRENCY_REGEX).required(),
        productCategory: Joi.string().regex(PRODUCT_CATEGORY_REGEX).required(),
        orderStatus: Joi.string().regex(ORDER_STATUS_REGEX).required(),
      })
    )
    .required(),
  customerId: Joi.string().required(),
  dateOfPurchase: Joi.date().required(),
  purchaseAmount: Joi.number().required(),
  purchaseCurrency: Joi.string().regex(CURRENCY_REGEX).required(),
  purchaseStoreLocation: Joi.string().regex(STORE_LOCATION_REGEX).required(),
  purchaseKind: Joi.string().regex(PURCHASE_KIND_REGEX).required(),
  shippingAddress: Joi.object({
    addressLine: Joi.string().regex(ADDRESS_LINE_REGEX).required(),
    city: Joi.string().regex(CITY_REGEX).required(),
    province: Joi.string().optional().allow(""),
    state: Joi.string().optional().allow(""),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  })
    .optional()
    .allow(null),
  paymentInformation: PAYMENT_INFORMATION_SCHEMA,
});

const updatePurchaseJoiSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().optional(),
        sku: Joi.string().optional(),
        quantity: Joi.number().optional(),
        price: Joi.number().optional(),
        currency: Joi.string().regex(CURRENCY_REGEX).optional(),
        productCategory: Joi.string().regex(PRODUCT_CATEGORY_REGEX).optional(),
        orderStatus: Joi.string().regex(ORDER_STATUS_REGEX).optional(),
      })
    )
    .optional(),
  customerId: Joi.string().optional(),
  dateOfPurchase: Joi.date().optional(),
  purchaseAmount: Joi.number().optional(),
  purchaseCurrency: Joi.string().regex(CURRENCY_REGEX).optional(),
  purchaseStoreLocation: Joi.string().regex(STORE_LOCATION_REGEX).optional(),
  purchaseKind: Joi.string().regex(PURCHASE_KIND_REGEX).optional(),
  shippingAddress: Joi.object({
    addressLine: Joi.string().regex(ADDRESS_LINE_REGEX).optional(),
    city: Joi.string().regex(CITY_REGEX).optional(),
    province: Joi.string().optional().allow(""),
    state: Joi.string().optional().allow(""),
    postalCode: Joi.string().optional(),
    country: Joi.string().optional(),
  })
    .optional()
    .allow(null),
});

export { createPurchaseJoiSchema, updatePurchaseJoiSchema };
