/**
 * This barrel file is used to import/export purchase online: model, router, types, handlers and services
 */

/**
 * Imports
 */

import { ProductReviewModel } from "./productReview.model";
import { productReviewRouter } from "./productReview.routes";
import {
  updateProductReviewsBulkController,
  createNewProductReviewController,
  createNewProductReviewsBulkController,
  deleteAllProductReviewsController,
  deleteProductReviewController,
  getAllProductReviewsBulkController,
  getProductReviewByIdController,
  getQueriedProductReviewsController,
  getQueriedProductReviewsByUserController,
  updateProductReviewByIdController,
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
  updateProductReviewsBulkController,
  createNewProductReviewController,
  createNewProductReviewService,
  createNewProductReviewsBulkController,
  deleteAProductReviewService,
  deleteAllProductReviewsController,
  deleteAllProductReviewsService,
  deleteProductReviewController,
  getAllProductReviewsBulkController,
  getAllProductReviewsService,
  getProductReviewByIdController,
  getProductReviewByIdService,
  getQueriedProductReviewsByUserService,
  getQueriedProductReviewsController,
  getQueriedProductReviewsService,
  getQueriedProductReviewsByUserController,
  getQueriedTotalProductReviewsService,
  productReviewRouter,
  updateProductReviewByIdController,
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
