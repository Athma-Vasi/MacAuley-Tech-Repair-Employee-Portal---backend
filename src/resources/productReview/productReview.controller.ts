import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  CreateNewProductReviewsBulkRequest,
  CreateNewProductReviewRequest,
  DeleteAProductReviewRequest,
  DeleteAllProductReviewsRequest,
  GetProductReviewByIdRequest,
  GetQueriedProductReviewsByUserRequest,
  GetQueriedProductReviewsRequest,
  UpdateProductReviewByIdRequest,
  UpdateProductReviewsFieldsBulkRequest,
  GetAllProductReviewsBulkRequest,
} from './productReview.types';

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
import { ProductReviewDocument, ProductReviewSchema } from './productReview.model';
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../types';
import type { FilterQuery, QueryOptions } from 'mongoose';
import { removeUndefinedAndNullValues } from '../../utils';

// @desc   Create new user
// @route  POST /api/v1/product-review
// @access Private
const createNewProductReviewHandler = expressAsyncHandler(
  async (
    request: CreateNewProductReviewRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      productReviewFields,
    } = request.body;

    const productReviewSchema: ProductReviewSchema = {
      ...productReviewFields,
      userId,
      username,
    };

    const productReviewDocument: ProductReviewDocument = await createNewProductReviewService(
      productReviewSchema
    );
    if (!productReviewDocument) {
      response.status(400).json({ message: 'Product review creation failed', resourceData: [] });
      return;
    }

    response.status(201).json({
      message: 'Product review created successfully',
      resourceData: [productReviewDocument],
    });
  }
);

// DEV ROUTE
// @desc   create new productReviews in bulk
// @route  POST /api/v1/product-review/dev
// @access Private
const createNewProductReviewsBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewProductReviewsBulkRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>
  ) => {
    const { productReviewSchemas } = request.body;

    const productReviewDocuments = await Promise.all(
      productReviewSchemas.map(async (productReviewSchema) => {
        const productReviewDocument: ProductReviewDocument = await createNewProductReviewService(
          productReviewSchema
        );
        return productReviewDocument;
      })
    );

    // filter out undefined values
    const productReviewDocumentsFiltered = productReviewDocuments.filter(
      removeUndefinedAndNullValues
    );

    // check if any productReviews were created
    if (productReviewDocumentsFiltered.length === productReviewSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${productReviewDocumentsFiltered.length} product review(s)`,
        resourceData: productReviewDocumentsFiltered,
      });
    } else {
      response.status(400).json({
        message: `Successfully created ${
          productReviewDocumentsFiltered.length
        } product review(s), but failed to create ${
          productReviewSchemas.length - productReviewDocumentsFiltered.length
        } product review(s)`,
        resourceData: productReviewDocumentsFiltered,
      });
    }
  }
);

// DEV ROUTE
// @desc   Add field to all productReviews
// @route  PATCH /api/v1/product-review/dev/add-field
// @access Private
const addFieldToProductReviewsBulkHandler = expressAsyncHandler(
  async (
    request: UpdateProductReviewsFieldsBulkRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>
  ) => {
    const { productReviewObjs } = request.body;

    const updatedProductReviews = await Promise.all(
      productReviewObjs.map(async ({ productReviewFields, productReviewId }) => {
        const updatedProductReview = await updateProductReviewByIdService({
          productReviewFields,
          productReviewId,
        });

        return updatedProductReview;
      })
    );

    // filter out undefined values
    const updatedProductReviewsFiltered = updatedProductReviews.filter(
      removeUndefinedAndNullValues
    );

    // check if any productReviews were updated
    if (updatedProductReviewsFiltered.length === productReviewObjs.length) {
      response.status(201).json({
        message: `Successfully updated ${updatedProductReviewsFiltered.length} product reviews`,
        resourceData: updatedProductReviewsFiltered,
      });
    } else {
      response.status(400).json({
        message: `Successfully updated ${
          updatedProductReviewsFiltered.length
        } product reviews(s), but failed to update ${
          productReviewObjs.length - updatedProductReviewsFiltered.length
        } product reviews(s)`,
        resourceData: updatedProductReviewsFiltered,
      });
    }
  }
);

// DEV ROUTE
// @desc   get all productReviews bulk (no filter, projection or options)
// @route  GET /api/v1/product-review/dev
// @access Private
const getAllProductReviewsBulkHandler = expressAsyncHandler(
  async (
    request: GetAllProductReviewsBulkRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>
  ) => {
    const productReviews = await getAllProductReviewsService();

    if (!productReviews.length) {
      response.status(200).json({
        message: 'Unable to find any product reviews. Please try again!',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found product reviews!',
      resourceData: productReviews,
    });
  }
);

// @desc   Get all productReviews queried
// @route  GET /api/v1/product-review
// @access Private
const getQueriedProductReviewsHandler = expressAsyncHandler(
  async (
    request: GetQueriedProductReviewsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<ProductReviewDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalProductReviewsService({
        filter: filter as FilterQuery<ProductReviewDocument> | undefined,
      });
    }

    // get all productReviews
    const productReviews = await getQueriedProductReviewsService({
      filter: filter as FilterQuery<ProductReviewDocument> | undefined,
      projection: projection as QueryOptions<ProductReviewDocument>,
      options: options as QueryOptions<ProductReviewDocument>,
    });
    if (!productReviews.length) {
      response.status(200).json({
        message: 'No product reviews that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found product reviews',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: productReviews,
    });
  }
);

// @desc   Get all productReviews queried by a user
// @route  GET /api/v1/product-review/user
// @access Private
const getQueriedPurchasesOnlineByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedProductReviewsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<ProductReviewDocument>>
  ) => {
    let { newQueryFlag, totalDocuments, userToBeQueriedId } = request.body;

    let { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // assign userToBeQueriedId to filter
    filter = { ...filter, customerId: userToBeQueriedId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalProductReviewsService({
        filter: filter as FilterQuery<ProductReviewDocument> | undefined,
      });
    }

    // get all productReviews
    const productReviews = await getQueriedProductReviewsService({
      filter: filter as FilterQuery<ProductReviewDocument> | undefined,
      projection: projection as QueryOptions<ProductReviewDocument>,
      options: options as QueryOptions<ProductReviewDocument>,
    });
    if (!productReviews.length) {
      response.status(200).json({
        message: 'No product reviews that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found product reviews',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: productReviews,
    });
  }
);

// @desc   Get a productReview by id
// @route  GET /api/v1/product-review/:id
// @access Private
const getProductReviewByIdHandler = expressAsyncHandler(
  async (
    request: GetProductReviewByIdRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>
  ) => {
    const { productReviewId } = request.params;

    const productReviewDocument = await getProductReviewByIdService(productReviewId);

    if (!productReviewDocument) {
      response.status(404).json({ message: 'Product review not found.', resourceData: [] });
      return;
    }

    response.status(200).json({
      message: 'Successfully found product reviews data!',
      resourceData: [productReviewDocument],
    });
  }
);

// @desc   Delete a productReview
// @route  DELETE /api/v1/product-review
// @access Private
const deleteProductReviewHandler = expressAsyncHandler(
  async (
    request: DeleteAProductReviewRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>
  ) => {
    const { productReviewId } = request.params;

    const deletedProductReview = await deleteAProductReviewService(productReviewId);

    if (!deletedProductReview.acknowledged) {
      response
        .status(400)
        .json({ message: 'Failed to delete product review. Please try again!', resourceData: [] });
      return;
    }

    response
      .status(200)
      .json({ message: 'Successfully deleted product review!', resourceData: [] });
  }
);

// @desc   Update a productReview in-store
// @route  PATCH /api/v1/product-review
// @access Private
const updateProductReviewByIdHandler = expressAsyncHandler(
  async (
    request: UpdateProductReviewByIdRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>
  ) => {
    const { productReviewId } = request.params;
    const { productReviewFields } = request.body;

    // update user if all checks pass successfully
    const updatedProductReview = await updateProductReviewByIdService({
      productReviewFields,
      productReviewId,
    });

    if (!updatedProductReview) {
      response.status(400).json({ message: 'Product review update failed', resourceData: [] });
      return;
    }

    response.status(200).json({
      message: 'Product review updated successfully',
      resourceData: [updatedProductReview],
    });
  }
);

// @desc   Delete all productReviews
// @route  DELETE /api/v1/product-review/delete-all
// @access Private
const deleteAllProductReviewsHandler = expressAsyncHandler(
  async (
    request: DeleteAllProductReviewsRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>
  ) => {
    const deletedProductReviews = await deleteAllProductReviewsService();

    if (!deletedProductReviews.acknowledged) {
      response
        .status(400)
        .json({ message: 'Failed to delete product reviews. Please try again!', resourceData: [] });
      return;
    }

    response
      .status(200)
      .json({ message: 'Successfully deleted product reviews!', resourceData: [] });
  }
);

export {
  deleteAllProductReviewsHandler,
  addFieldToProductReviewsBulkHandler,
  createNewProductReviewHandler,
  createNewProductReviewsBulkHandler,
  deleteProductReviewHandler,
  getAllProductReviewsBulkHandler,
  getProductReviewByIdHandler,
  getQueriedProductReviewsHandler,
  updateProductReviewByIdHandler,
  getQueriedPurchasesOnlineByUserHandler,
};
