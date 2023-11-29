/**
 * This barrel file is used to import/export purchase online: model, router, types, handlers and services
 */

/**
 * Imports
 */

import { ProductReviewModel } from "./productReview.model";
import { productReviewRouter } from "./productReview.routes";
import {
	updateProductReviewsBulkHandler,
	createNewProductReviewHandler,
	createNewProductReviewsBulkHandler,
	deleteAllProductReviewsHandler,
	deleteProductReviewHandler,
	getAllProductReviewsBulkHandler,
	getProductReviewByIdHandler,
	getQueriedProductReviewsHandler,
	getQueriedPurchasesOnlineByUserHandler,
	updateProductReviewByIdHandler,
} from "./productReview.controller";
import {
	createNewProductReviewService,
	deleteAProductReviewService,
	deleteAllProductReviewsService,
	getAllProductReviewsService,
	getProductReviewByIdService,
	getQueriedProductReviewsByUserService,
	getQueriedProductReviewsService,
	getQueriedTotalProductReviewsService,
	updateProductReviewByIdService,
} from "./productReview.service";

import type {
	ProductReviewDocument,
	RatingKind,
	ProductReviewSchema,
} from "./productReview.model";
import type {
	CreateNewProductReviewRequest,
	CreateNewProductReviewsBulkRequest,
	DeleteAProductReviewRequest,
	DeleteAllProductReviewsRequest,
	GetAllProductReviewsBulkRequest,
	GetProductReviewByIdRequest,
	GetQueriedProductReviewsByUserRequest,
	GetQueriedProductReviewsRequest,
	UpdateProductReviewByIdRequest,
	UpdateProductReviewsBulkRequest,
} from "./productReview.types";

/**
 * Exports
 */

export {
	ProductReviewModel,
	updateProductReviewsBulkHandler,
	createNewProductReviewHandler,
	createNewProductReviewService,
	createNewProductReviewsBulkHandler,
	deleteAProductReviewService,
	deleteAllProductReviewsHandler,
	deleteAllProductReviewsService,
	deleteProductReviewHandler,
	getAllProductReviewsBulkHandler,
	getAllProductReviewsService,
	getProductReviewByIdHandler,
	getProductReviewByIdService,
	getQueriedProductReviewsByUserService,
	getQueriedProductReviewsHandler,
	getQueriedProductReviewsService,
	getQueriedPurchasesOnlineByUserHandler,
	getQueriedTotalProductReviewsService,
	productReviewRouter,
	updateProductReviewByIdHandler,
	updateProductReviewByIdService,
};

export type {
	CreateNewProductReviewRequest,
	CreateNewProductReviewsBulkRequest,
	DeleteAProductReviewRequest,
	DeleteAllProductReviewsRequest,
	GetAllProductReviewsBulkRequest,
	GetProductReviewByIdRequest,
	GetQueriedProductReviewsByUserRequest,
	GetQueriedProductReviewsRequest,
	RatingKind,
	ProductReviewDocument,
	ProductReviewSchema,
	UpdateProductReviewByIdRequest,
	UpdateProductReviewsBulkRequest,
};
