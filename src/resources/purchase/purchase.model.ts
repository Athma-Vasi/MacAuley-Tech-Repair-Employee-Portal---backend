import { Types } from "mongoose";
import { Currency } from "../actions/company/expenseClaim";
import { PaymentInformation } from "../customer/customer.model";
import { Address, StoreLocation } from "../user/user.model";

type OrderStatus =
	| "Pending"
	| "Shipped"
	| "Delivered"
	| "Returned"
	| "Cancelled"
	| "Received";

type ProductPurchase = {
	productId: Types.ObjectId;
	quantity: number;
};

type PurchaseSchema = {
	productsIds: Types.ObjectId[];
	customerId: Types.ObjectId;

	dateOfPurchase: NativeDate;
	purchaseAmount: number;
	purchaseCurrency: Currency; // assume that 3rd party API will convert to CAD
	purchaseStoreLocation: StoreLocation;
	orderStatus: OrderStatus;
	shippingAddress: Address;

	paymentInformation: PaymentInformation;
};
