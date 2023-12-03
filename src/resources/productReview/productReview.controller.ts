import expressAsyncHandler from "express-async-handler";

import type { Response } from "express";
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
  getQueriedProductReviewsByUserService,
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

    const productReviewDocument: ProductReviewDocument =
      await createNewProductReviewService(productReviewSchema);
    if (!productReviewDocument) {
      response
        .status(400)
        .json({ message: "Product review creation failed", resourceData: [] });
      return;
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
const createNewProductReviewsBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewProductReviewsBulkRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>
  ) => {
    const { productReviewSchemas } = request.body;

    const productReviewDocuments = await Promise.all(
      productReviewSchemas.map(async (productReviewSchema) => {
        const productReviewDocument: ProductReviewDocument =
          await createNewProductReviewService(productReviewSchema);
        return productReviewDocument;
      })
    );

    // filter out any productReviews that were not created
    const successfullyCreatedProductReviews = productReviewDocuments.filter(
      removeUndefinedAndNullValues
    );

    // check if any productReviews were created
    if (successfullyCreatedProductReviews.length === productReviewSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedProductReviews.length} Product Reviews`,
        resourceData: successfullyCreatedProductReviews,
      });
      return;
    }

    if (successfullyCreatedProductReviews.length === 0) {
      response.status(400).json({
        message: "Could not create any Product Reviews",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        productReviewSchemas.length - successfullyCreatedProductReviews.length
      } Product Reviews`,
      resourceData: successfullyCreatedProductReviews,
    });
    return;
  }
);

// DEV ROUTE
// @desc   Add field to all productReviews
// @route  PATCH /api/v1/product-review/dev
// @access Private
const updateProductReviewsBulkHandler = expressAsyncHandler(
  async (
    request: UpdateProductReviewsBulkRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>
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

    // filter out any productReviews that were not created
    const successfullyCreatedProductReviews = updatedProductReviews.filter(
      removeUndefinedAndNullValues
    );

    // check if any productReviews were created
    if (successfullyCreatedProductReviews.length === productReviewFields.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedProductReviews.length} Product Reviews`,
        resourceData: successfullyCreatedProductReviews,
      });
      return;
    }

    if (successfullyCreatedProductReviews.length === 0) {
      response.status(400).json({
        message: "Could not create any Product Reviews",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        productReviewFields.length - successfullyCreatedProductReviews.length
      } Product Reviews`,
      resourceData: successfullyCreatedProductReviews,
    });
    return;
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
        message: "Unable to find any product reviews. Please try again!",
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
const getQueriedProductReviewsHandler = expressAsyncHandler(
  async (
    request: GetQueriedProductReviewsRequest,
    response: Response<
      GetQueriedResourceRequestServerResponse<
        ProductReviewDocument & {
          productCategoryDocs: Record<string, any>[];
        }
      >
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

    // get all productReviews
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
const getQueriedProductReviewsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedProductReviewsByUserRequest,
    response: Response<
      GetQueriedResourceRequestServerResponse<ProductReviewServerResponseDocument>
    >
  ) => {
    let { newQueryFlag, totalDocuments, userToBeQueriedId } = request.body;

    let { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // assign userToBeQueriedId to filter
    filter = { ...filter, userId: userToBeQueriedId };

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
const getProductReviewByIdHandler = expressAsyncHandler(
  async (
    request: GetProductReviewByIdRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewServerResponseDocument>>
  ) => {
    const { productReviewId } = request.params;

    const productReviewDocument = await getProductReviewByIdService(productReviewId);

    if (!productReviewDocument) {
      response
        .status(404)
        .json({ message: "Product review not found.", resourceData: [] });
      return;
    }

    // grab product category document
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
const deleteProductReviewHandler = expressAsyncHandler(
  async (
    request: DeleteAProductReviewRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>
  ) => {
    const { productReviewId } = request.params;

    const deletedProductReview = await deleteAProductReviewService(productReviewId);

    if (!deletedProductReview.acknowledged) {
      response.status(400).json({
        message: "Failed to delete product review. Please try again!",
        resourceData: [],
      });
      return;
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
const updateProductReviewByIdHandler = expressAsyncHandler(
  async (
    request: UpdateProductReviewByIdRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewServerResponseDocument>>
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
      response
        .status(400)
        .json({ message: "Product review update failed", resourceData: [] });
      return;
    }

    // grab product category document
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
const deleteAllProductReviewsHandler = expressAsyncHandler(
  async (
    request: DeleteAllProductReviewsRequest,
    response: Response<ResourceRequestServerResponse<ProductReviewDocument>>
  ) => {
    const deletedProductReviews = await deleteAllProductReviewsService();

    if (!deletedProductReviews.acknowledged) {
      response.status(400).json({
        message: "Failed to delete product reviews. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully deleted product reviews!",
      resourceData: [],
    });
  }
);

export {
  updateProductReviewsBulkHandler,
  createNewProductReviewHandler,
  createNewProductReviewsBulkHandler,
  deleteAllProductReviewsHandler,
  deleteProductReviewHandler,
  getAllProductReviewsBulkHandler,
  getProductReviewByIdHandler,
  getQueriedProductReviewsHandler,
  getQueriedProductReviewsByUserHandler,
  updateProductReviewByIdHandler,
};
