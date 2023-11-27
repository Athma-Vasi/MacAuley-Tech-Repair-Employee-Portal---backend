/**
 * This barrel file is used to import/export purchase online: model, router, types, handlers and services
 */

/**
 * Imports
 */

import { ProductReviewModel } from './productReview.model';
import { productReviewRouter } from './productReview.routes';
import {
  addFieldToProductReviewsBulkHandler,
  createNewProductReviewHandler,
  createNewProductReviewsBulkHandler,
  deleteProductReviewHandler,
  getAllProductReviewsBulkHandler,
  getProductReviewByIdHandler,
  getQueriedProductReviewsHandler,
  getQueriedPurchasesOnlineByUserHandler,
  updateProductReviewByIdHandler,
  deleteAllProductReviewsHandler,
} from './productReview.controller';
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
} from './productReview.service';

import type { ProductReviewDocument, ProductReviewSchema } from './productReview.model';
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
  UpdateProductReviewsFieldsBulkRequest,
} from './productReview.types';

/**
 * Exports
 */

export {
  ProductReviewModel,
  productReviewRouter,
  addFieldToProductReviewsBulkHandler,
  createNewProductReviewHandler,
  createNewProductReviewsBulkHandler,
  deleteProductReviewHandler,
  getAllProductReviewsBulkHandler,
  getProductReviewByIdHandler,
  getQueriedProductReviewsHandler,
  getQueriedPurchasesOnlineByUserHandler,
  updateProductReviewByIdHandler,
  createNewProductReviewService,
  deleteAProductReviewService,
  deleteAllProductReviewsService,
  getProductReviewByIdService,
  getQueriedProductReviewsByUserService,
  getQueriedProductReviewsService,
  getQueriedTotalProductReviewsService,
  updateProductReviewByIdService,
  deleteAllProductReviewsHandler,
};

export type {
  ProductReviewDocument,
  ProductReviewSchema,
  GetAllProductReviewsBulkRequest,
  CreateNewProductReviewRequest,
  GetQueriedProductReviewsByUserRequest,
  CreateNewProductReviewsBulkRequest,
  DeleteAProductReviewRequest,
  DeleteAllProductReviewsRequest,
  GetProductReviewByIdRequest,
  GetQueriedProductReviewsRequest,
  UpdateProductReviewByIdRequest,
  UpdateProductReviewsFieldsBulkRequest,
};
