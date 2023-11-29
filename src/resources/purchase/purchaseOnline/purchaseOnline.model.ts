import { Schema, Types, model } from "mongoose";
import { Currency } from "../../actions/company/expenseClaim";
import { Address, StoreLocation } from "../../user/user.model";
import { PaymentInformation } from "../../customer/customer.model";

type OrderStatus =
	| "Pending"
	| "Shipped"
	| "Delivered"
	| "Returned"
	| "Cancelled";

type PurchaseOnlineSchema = {
	productId: Types.ObjectId;
	productSku: string;
	productBrand: string;
	productModel: string;

	dateOfPurchase: NativeDate;
	purchaseAmount: number;
	purchaseCurrency: Currency;
	purchaseStoreLocation: StoreLocation;
	orderStatus: OrderStatus;
	shippingAddress: Address;

	customerId: Types.ObjectId;
	paymentInformation: PaymentInformation;
};

type PurchaseOnlineDocument = PurchaseOnlineSchema & {
	_id: Types.ObjectId;
	createdAt: NativeDate;
	updatedAt: NativeDate;
	__v: number;
};

const purchaseOnlineSchema = new Schema<PurchaseOnlineSchema>(
	{
		productId: {
			type: Schema.Types.ObjectId,
			required: [true, "Product ID is required"],
		},
		productSku: {
			type: String,
			required: [true, "Product SKU is required"],
		},
		productBrand: {
			type: String,
			required: [true, "Product Brand is required"],
		},
		productModel: {
			type: String,
			required: [true, "Product Model is required"],
		},

		dateOfPurchase: {
			type: Date,
			required: [true, "Date of Purchase is required"],
			index: true,
		},
		purchaseAmount: {
			type: Number,
			required: [true, "Purchase Amount is required"],
		},
		purchaseCurrency: {
			type: String,
			required: [true, "Purchase Currency is required"],
		},
		purchaseStoreLocation: {
			type: String,
			required: [true, "Purchase Store Location is required"],
		},
		orderStatus: {
			type: String,
			required: [true, "Order Status is required"],
		},

		shippingAddress: {
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
			required: [true, "Shipping Address is required"],
		},

		customerId: {
			type: Schema.Types.ObjectId,
			required: [true, "Customer ID is required"],
			ref: "Customer",
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
					required: [true, "Address line 1 is required"],
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
			required: [true, "Payment Information is required"],
		},
	},
	{ timestamps: true },
);

// text indexes for searching all user entered text input fields
purchaseOnlineSchema.index({
	productSku: "text",
	productBrand: "text",
	productModel: "text",
	"shippingAddress.addressLine": "text",
	"shippingAddress.city": "text",
	"shippingAddress.postalCode": "text",
	"paymentInformation.cardholderName": "text",
	"paymentInformation.billingAddress.addressLine": "text",
	"paymentInformation.billingAddress.city": "text",
	"paymentInformation.billingAddress.postalCode": "text",
});

const PurchaseOnlineModel = model<PurchaseOnlineDocument>(
	"PurchaseOnline",
	purchaseOnlineSchema,
);

export { PurchaseOnlineModel };
export type { PurchaseOnlineDocument, PurchaseOnlineSchema, OrderStatus };
