import expressAsyncController from "express-async-handler";

import type { NextFunction, Response } from "express";
import type {
  CreateNewProductReviewsBulkRequest,
  CreateNewProductReviewRequest,
  DeleteAProductReviewRequest,
  DeleteAllProductReviewsRequest,
  GetProductReviewByIdRequest,
  GetQueriedProductReviewsByUserRequest,
  GetQueriedProductReviewsRequest,
  UpdateProductReviewByIdRequest,
  UpdateProductReviewsBulkRequest,
  GetAllProductReviewsBulkRequest,
  ProductReviewServerResponseDocument,
} from "./productReview.types";

import {
  createNewProductReviewService,
  deleteAProductReviewService,
  deleteAllProductReviewsService,
  getAllProductReviewsService,
  getProductReviewByIdService,
  getQueriedProductReviewsService,
  getQueriedTotalProductReviewsService,
  updateProductReviewByIdService,
} from "./productReview.service";
import { ProductReviewDocument, ProductReviewSchema } from "./productReview.model";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../types";
import type { FilterQuery, QueryOptions } from "mongoose";
import { removeUndefinedAndNullValues } from "../../utils";
import { PRODUCT_CATEGORY_SERVICE_MAP } from "../../constants";
import createHttpError from "http-errors";

// @desc   Create new user
// @route  POST /api/v1/product-review
// @access Private
const createNewProductReviewController = expressAsyncController(
  async (
    request: CreateNewProductReviewRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>,
    next: NextFunction
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

    const productReviewDocument: ProductReviewDocument =
      await createNewProductReviewService(productReviewSchema);
    if (!productReviewDocument) {
      return next(
        new createHttpError.InternalServerError("Failed to create product review")
      );
    }

    response.status(201).json({
      message: "Product review created successfully",
      resourceData: [productReviewDocument],
    });
  }
);

// DEV ROUTE
// @desc   create new productReviews in bulk
// @route  POST /api/v1/product-review/dev
// @access Private
const createNewProductReviewsBulkController = expressAsyncController(
  async (
    request: CreateNewProductReviewsBulkRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>,
    next: NextFunction
  ) => {
    const { productReviewSchemas } = request.body;

    const productReviewDocuments = await Promise.all(
      productReviewSchemas.map(async (productReviewSchema) => {
        const productReviewDocument: ProductReviewDocument =
          await createNewProductReviewService(productReviewSchema);
        return productReviewDocument;
      })
    );

    const successfullyCreatedProductReviews = productReviewDocuments.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedProductReviews.length === 0) {
      response.status(400).json({
        message: "Could not create any Product Reviews",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedProductReviews.length
      } Product Reviews. ${
        productReviewSchemas.length - successfullyCreatedProductReviews.length
      } Product Reviews failed to be created.`,
      resourceData: successfullyCreatedProductReviews,
    });
    return;
  }
);

// DEV ROUTE
// @desc   Update productReviews in bulk
// @route  PATCH /api/v1/product-review/dev
// @access Private
const updateProductReviewsBulkController = expressAsyncController(
  async (
    request: UpdateProductReviewsBulkRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>,
    next: NextFunction
  ) => {
    const { productReviewFields } = request.body;

    const updatedProductReviews = await Promise.all(
      productReviewFields.map(async (productReviewField) => {
        const {
          documentUpdate: { fields, updateOperator },
          productReviewId,
        } = productReviewField;

        const updatedProductReview = await updateProductReviewByIdService({
          _id: productReviewId,
          fields,
          updateOperator,
        });

        return updatedProductReview;
      })
    );

    const successfullyCreatedProductReviews = updatedProductReviews.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedProductReviews.length === 0) {
      response.status(400).json({
        message: "Could not create any Product Reviews",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedProductReviews.length
      } Product Reviews. ${
        productReviewFields.length - successfullyCreatedProductReviews.length
      } Product Reviews failed to be created.`,
      resourceData: successfullyCreatedProductReviews,
    });
  }
);

// DEV ROUTE
// @desc   get all productReviews bulk (no filter, projection or options)
// @route  GET /api/v1/product-review/dev
// @access Private
const getAllProductReviewsBulkController = expressAsyncController(
  async (
    request: GetAllProductReviewsBulkRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>,
    next: NextFunction
  ) => {
    const productReviews = await getAllProductReviewsService();
    if (!productReviews.length) {
      response.status(200).json({
        message: "Unable to find any product reviews",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully found product reviews!",
      resourceData: productReviews,
    });
  }
);

// @desc   Get all productReviews queried
// @route  GET /api/v1/product-review
// @access Private
const getQueriedProductReviewsController = expressAsyncController(
  async (
    request: GetQueriedProductReviewsRequest,
    response: Response<
      GetQueriedResourceRequestServerResponse<ProductReviewServerResponseDocument>
    >
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalProductReviewsService({
        filter: filter as FilterQuery<ProductReviewDocument> | undefined,
      });
    }

    const productReviews = await getQueriedProductReviewsService({
      filter: filter as FilterQuery<ProductReviewDocument> | undefined,
      projection: projection as QueryOptions<ProductReviewDocument>,
      options: options as QueryOptions<ProductReviewDocument>,
    });

    if (!productReviews.length) {
      response.status(200).json({
        message: "No product reviews that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    const productCategoryDocs = await Promise.all(
      productReviews.map(async (productReview) => {
        const { productCategory, productId } = productReview;

        const productCategoryDocument = await PRODUCT_CATEGORY_SERVICE_MAP[
          productCategory
        ](productId);

        return productCategoryDocument;
      })
    );

    const productReviewsWithProductCategoryDocuments = productReviews.map(
      (productReview, index) => {
        return {
          ...productReview,
          productCategoryDocs: [productCategoryDocs[index]],
        };
      }
    );

    response.status(200).json({
      message: "Successfully found product reviews",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: productReviewsWithProductCategoryDocuments,
    });
  }
);

// @desc   Get all productReviews queried by a user
// @route  GET /api/v1/product-review/user
// @access Private
const getQueriedProductReviewsByUserController = expressAsyncController(
  async (
    request: GetQueriedProductReviewsByUserRequest,
    response: Response<
      GetQueriedResourceRequestServerResponse<ProductReviewServerResponseDocument>
    >
  ) => {
    let { newQueryFlag, totalDocuments, userToBeQueriedId } = request.body;

    let { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    filter = { ...filter, userId: userToBeQueriedId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalProductReviewsService({
        filter: filter as FilterQuery<ProductReviewDocument> | undefined,
      });
    }

    const productReviews = await getQueriedProductReviewsService({
      filter: filter as FilterQuery<ProductReviewDocument> | undefined,
      projection: projection as QueryOptions<ProductReviewDocument>,
      options: options as QueryOptions<ProductReviewDocument>,
    });

    if (!productReviews.length) {
      response.status(200).json({
        message: "No product reviews that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    const productCategoryDocs = await Promise.all(
      productReviews.map(async (productReview) => {
        const { productCategory, productId } = productReview;

        const productCategoryDocument = await PRODUCT_CATEGORY_SERVICE_MAP[
          productCategory
        ](productId);

        return productCategoryDocument;
      })
    );

    const productReviewsWithProductCategoryDocuments = productReviews.map(
      (productReview, index) => {
        return {
          ...productReview,
          productCategoryDocs: [productCategoryDocs[index]],
        };
      }
    );

    response.status(200).json({
      message: "Successfully found product reviews",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: productReviewsWithProductCategoryDocuments,
    });
  }
);

// @desc   Get a productReview by id
// @route  GET /api/v1/product-review/:id
// @access Private
const getProductReviewByIdController = expressAsyncController(
  async (
    request: GetProductReviewByIdRequest,
    response: Response<
      ResourceRequestServerResponse<ProductReviewServerResponseDocument>
    >,
    next: NextFunction
  ) => {
    const { productReviewId } = request.params;

    const productReviewDocument = await getProductReviewByIdService(productReviewId);
    if (!productReviewDocument) {
      return next(new createHttpError.NotFound("Product review not found"));
    }

    const { productCategory, productId } = productReviewDocument;
    const productCategoryDocument = await PRODUCT_CATEGORY_SERVICE_MAP[productCategory](
      productId
    );

    const productReviewDocumentWithProductCategoryDocument = {
      ...productReviewDocument,
      productCategoryDocs: [productCategoryDocument],
    };

    response.status(200).json({
      message: "Successfully found product reviews data!",
      resourceData: [productReviewDocumentWithProductCategoryDocument],
    });
  }
);

// @desc   Delete a productReview
// @route  DELETE /api/v1/product-review
// @access Private
const deleteProductReviewController = expressAsyncController(
  async (
    request: DeleteAProductReviewRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>,
    next: NextFunction
  ) => {
    const { productReviewId } = request.params;

    const deletedProductReview = await deleteAProductReviewService(productReviewId);
    if (!deletedProductReview.deletedCount) {
      return next(
        new createHttpError.InternalServerError("Failed to delete product review")
      );
    }

    response.status(200).json({
      message: "Successfully deleted product review!",
      resourceData: [],
    });
  }
);

// @desc   Update a productReview
// @route  PATCH /api/v1/product-review
// @access Private
const updateProductReviewByIdController = expressAsyncController(
  async (
    request: UpdateProductReviewByIdRequest,
    response: Response<
      ResourceRequestServerResponse<ProductReviewServerResponseDocument>
    >,
    next: NextFunction
  ) => {
    const { productReviewId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedProductReview = await updateProductReviewByIdService({
      _id: productReviewId,
      fields,
      updateOperator,
    });

    if (!updatedProductReview) {
      return next(
        new createHttpError.InternalServerError("Failed to update product review")
      );
    }

    const { productCategory, productId } = updatedProductReview;
    const productCategoryDocument = await PRODUCT_CATEGORY_SERVICE_MAP[productCategory](
      productId
    );

    const productReviewDocumentWithProductCategoryDocument = {
      ...updatedProductReview,
      productCategoryDocs: [productCategoryDocument],
    };

    response.status(200).json({
      message: "Product review updated successfully",
      resourceData: [productReviewDocumentWithProductCategoryDocument],
    });
  }
);

// @desc   Delete all productReviews
// @route  DELETE /api/v1/product-review/delete-all
// @access Private
const deleteAllProductReviewsController = expressAsyncController(
  async (
    request: DeleteAllProductReviewsRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>,
    next: NextFunction
  ) => {
    const deletedProductReviews = await deleteAllProductReviewsService();

    if (!deletedProductReviews.deletedCount) {
      return next(
        new createHttpError.InternalServerError("Failed to delete product reviews")
      );
    }

    response.status(200).json({
      message: "Successfully deleted product reviews",
      resourceData: [],
    });
  }
);

export {
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
};
