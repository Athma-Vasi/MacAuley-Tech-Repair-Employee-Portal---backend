import { Types, Schema, model } from "mongoose";
import { ProductCategory } from "../actions/dashboard/productCategory";

type RatingKind =
	| "0.5"
	| "1"
	| "1.5"
	| "2"
	| "2.5"
	| "3"
	| "3.5"
	| "4"
	| "4.5"
	| "5";

type ProductReviewSchema = {
	userId: Types.ObjectId; // customer id
	username: string; // customer username
	productId: Types.ObjectId;
	productCategory: ProductCategory;
	productBrand: string;
	productModel: string;
	productReview: string;
	productRating: RatingKind;
	helpfulVotes: number;
	unhelpfulVotes: number;
	isVerifiedPurchase: boolean;
};

type ProductReviewDocument = ProductReviewSchema & {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
	__v: number;
};

const productReviewSchema = new Schema<ProductReviewSchema>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: [true, "User ID is required"],
			ref: "Customer",
			index: true,
		},
		username: {
			type: String,
			required: [true, "Username is required"],
		},

		productId: {
			type: Schema.Types.ObjectId,
			required: [true, "Product ID is required"],
			index: true,
		},
		productCategory: {
			type: String,
			required: [true, "Product Category is required"],
		},
		productBrand: {
			type: String,
			required: [true, "Product Brand is required"],
		},
		productModel: {
			type: String,
			required: [true, "Product Model is required"],
		},
		productReview: {
			type: String,
			required: [true, "Product Review is required"],
		},
		productRating: {
			type: String,
			required: [true, "Product Rating is required"],
			index: true,
		},
		helpfulVotes: {
			type: Number,
			required: [true, "Helpful Votes is required"],
		},
		unhelpfulVotes: {
			type: Number,
			required: [true, "Unhelpful Votes is required"],
		},
		isVerifiedPurchase: {
			type: Boolean,
			required: [true, "Is Verified Purchase is required"],
		},
	},
	{ timestamps: true },
);

// text index for searching
productReviewSchema.index({
	username: "text",
	productBrand: "text",
	productModel: "text",
	productReview: "text",
});

const ProductReviewModel = model<ProductReviewDocument>(
	"ProductReview",
	productReviewSchema,
);

export { ProductReviewModel };
export type { ProductReviewDocument, ProductReviewSchema, RatingKind };
