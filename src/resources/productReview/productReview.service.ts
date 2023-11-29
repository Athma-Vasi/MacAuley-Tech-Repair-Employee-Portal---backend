import type { Types } from "mongoose";
import type { DeleteResult } from "mongodb";
import type {
	ProductReviewDocument,
	ProductReviewSchema,
} from "./productReview.model";
import type {
	DatabaseResponse,
	DatabaseResponseNullable,
	QueriedResourceGetRequestServiceInput,
	QueriedTotalResourceGetRequestServiceInput,
} from "../../types";

import { ProductReviewModel } from "./productReview.model";

async function createNewProductReviewService(
	productReviewSchema: ProductReviewSchema,
): Promise<ProductReviewDocument> {
	try {
		const productReview = await ProductReviewModel.create(productReviewSchema);
		return productReview;
	} catch (error: any) {
		throw new Error(error, { cause: "createNewProductReviewService" });
	}
}

async function getAllProductReviewsService(): DatabaseResponse<ProductReviewDocument> {
	try {
		const productReviews = await ProductReviewModel.find({})
			.select(["-__v"])
			.lean()
			.exec();
		return productReviews;
	} catch (error: any) {
		throw new Error(error, { cause: "getAllProductReviewsService" });
	}
}

async function getQueriedProductReviewsService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<ProductReviewDocument>): DatabaseResponse<ProductReviewDocument> {
	try {
		const productReviews = await ProductReviewModel.find(
			filter,
			projection,
			options,
		)
			.select(["-__v"])
			.lean()
			.exec();
		return productReviews;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedProductReviewsService" });
	}
}

async function getQueriedTotalProductReviewsService({
	filter = {},
}: QueriedTotalResourceGetRequestServiceInput<ProductReviewDocument>): Promise<number> {
	try {
		const totalProductReviews = await ProductReviewModel.countDocuments(filter)
			.lean()
			.exec();
		return totalProductReviews;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedTotalProductReviewsService" });
	}
}

async function getQueriedProductReviewsByUserService({
	filter = {},
	projection = null,
	options = {},
}: QueriedResourceGetRequestServiceInput<ProductReviewDocument>): DatabaseResponse<ProductReviewDocument> {
	try {
		const productReviews = await ProductReviewModel.find(
			filter,
			projection,
			options,
		)
			.select(["-__v"])
			.lean()
			.exec();
		return productReviews;
	} catch (error: any) {
		throw new Error(error, { cause: "getQueriedProductReviewsByUserService" });
	}
}

async function getProductReviewByIdService(
	productReviewId: Types.ObjectId | string,
): DatabaseResponseNullable<ProductReviewDocument> {
	try {
		const productReview = await ProductReviewModel.findById(productReviewId)
			.select(["-__v"])
			.lean()
			.exec();
		return productReview;
	} catch (error: any) {
		throw new Error(error, { cause: "getProductReviewByIdService" });
	}
}

async function updateProductReviewByIdService({
	productReviewId,
	productReviewFields,
}: {
	productReviewId: Types.ObjectId | string;
	productReviewFields: Partial<ProductReviewSchema>;
}): DatabaseResponseNullable<ProductReviewDocument> {
	try {
		const productReview = await ProductReviewModel.findByIdAndUpdate(
			productReviewId,
			{ ...productReviewFields },
			{ new: true },
		)
			.select("-__v")
			.lean()
			.exec();
		return productReview;
	} catch (error: any) {
		throw new Error(error, { cause: "updateProductReviewByIdService" });
	}
}

async function deleteAProductReviewService(
	productReviewId: string,
): Promise<DeleteResult> {
	try {
		const productReview = await ProductReviewModel.deleteOne({
			_id: productReviewId,
		})
			.lean()
			.exec();
		return productReview;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAProductReviewService" });
	}
}

async function deleteAllProductReviewsService(): Promise<DeleteResult> {
	try {
		const productReviews = await ProductReviewModel.deleteMany({})
			.lean()
			.exec();
		return productReviews;
	} catch (error: any) {
		throw new Error(error, { cause: "deleteAllProductReviewsService" });
	}
}

export {
	createNewProductReviewService,
	getAllProductReviewsService,
	getProductReviewByIdService,
	deleteAProductReviewService,
	deleteAllProductReviewsService,
	getQueriedProductReviewsService,
	getQueriedProductReviewsByUserService,
	getQueriedTotalProductReviewsService,
	updateProductReviewByIdService,
};
