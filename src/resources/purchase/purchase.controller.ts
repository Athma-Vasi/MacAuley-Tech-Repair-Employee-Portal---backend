import expressAsyncController from "express-async-handler";

import type { NextFunction, Response } from "express";
import type {
  CreateNewPurchasesBulkRequest,
  CreateNewPurchaseRequest,
  DeleteAPurchaseRequest,
  DeleteAllPurchasesRequest,
  GetPurchaseByIdRequest,
  GetQueriedPurchasesByUserRequest,
  GetQueriedPurchasesRequest,
  UpdatePurchaseByIdRequest,
  UpdatePurchasesBulkRequest,
  GetAllPurchasesBulkRequest,
  PurchaseServerResponseDocument,
} from "./purchase.types";

import {
  createNewPurchaseService,
  deleteAPurchaseService,
  deleteAllPurchasesService,
  getAllPurchasesService,
  getPurchaseByIdService,
  getQueriedPurchasesService,
  getQueriedTotalPurchasesService,
  updatePurchaseByIdService,
} from "./purchase.service";
import { PurchaseDocument, PurchaseSchema } from "./purchase.model";
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
// @route  POST /api/v1/purchase
// @access Private
const createNewPurchaseController = expressAsyncController(
  async (
    request: CreateNewPurchaseRequest,
    response: Response<ResourceRequestServerResponse<PurchaseDocument>>,
    next: NextFunction
  ) => {
    const {
      userInfo: { userId },
      purchaseFields,
    } = request.body;

    const purchaseSchema: PurchaseSchema = {
      ...purchaseFields,
      customerId: userId,
    };

    const purchaseDocument: PurchaseDocument = await createNewPurchaseService(
      purchaseSchema
    );
    if (!purchaseDocument) {
      return next(
        new createHttpError.InternalServerError("Failed to create new purchase")
      );
    }

    response.status(201).json({
      message: "Purchase created successfully",
      resourceData: [purchaseDocument],
    });
  }
);

// DEV ROUTE
// @desc   create new purchase in bulk
// @route  POST /api/v1/purchase/dev
// @access Private
const createNewPurchasesBulkController = expressAsyncController(
  async (
    request: CreateNewPurchasesBulkRequest,
    response: Response<ResourceRequestServerResponse<PurchaseDocument>>,
    next: NextFunction
  ) => {
    const { purchaseSchemas } = request.body;

    const purchaseDocuments = await Promise.all(
      purchaseSchemas.map(async (purchaseSchema) => {
        const purchaseDocument: PurchaseDocument = await createNewPurchaseService(
          purchaseSchema
        );
        return purchaseDocument;
      })
    );

    const successfullyCreatedPurchases = purchaseDocuments.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedPurchases.length === purchaseSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedPurchases.length} Purchases`,
        resourceData: successfullyCreatedPurchases,
      });
      return;
    }

    if (successfullyCreatedPurchases.length === 0) {
      response.status(400).json({
        message: "Could not create any Purchases",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        purchaseSchemas.length - successfullyCreatedPurchases.length
      } Purchases`,
      resourceData: successfullyCreatedPurchases,
    });
    return;
  }
);

// DEV ROUTE
// @desc   Add field to all purchase
// @route  PATCH /api/v1/purchase/dev
// @access Private
const updatePurchasesBulkController = expressAsyncController(
  async (
    request: UpdatePurchasesBulkRequest,
    response: Response<ResourceRequestServerResponse<PurchaseDocument>>,
    next: NextFunction
  ) => {
    const { purchaseFields } = request.body;

    const updatedPurchases = await Promise.all(
      purchaseFields.map(async (purchaseField) => {
        const {
          documentUpdate: { fields, updateOperator },
          purchaseId,
        } = purchaseField;

        const updatedPurchase = await updatePurchaseByIdService({
          _id: purchaseId,
          fields,
          updateOperator,
        });

        return updatedPurchase;
      })
    );

    const successfullyCreatedPurchases = updatedPurchases.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedPurchases.length === purchaseFields.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedPurchases.length} Purchases`,
        resourceData: successfullyCreatedPurchases,
      });
      return;
    }

    if (successfullyCreatedPurchases.length === 0) {
      response.status(400).json({
        message: "Could not create any Purchases",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        purchaseFields.length - successfullyCreatedPurchases.length
      } Purchases`,
      resourceData: successfullyCreatedPurchases,
    });
    return;
  }
);

// DEV ROUTE
// @desc   get all purchase bulk (no filter, projection or options)
// @route  GET /api/v1/purchase/dev
// @access Private
const getAllPurchasesBulkController = expressAsyncController(
  async (
    request: GetAllPurchasesBulkRequest,
    response: Response<ResourceRequestServerResponse<PurchaseDocument>>,
    next: NextFunction
  ) => {
    const purchases = await getAllPurchasesService();

    if (!purchases.length) {
      response.status(200).json({
        message: "Unable to find any purchases",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully found purchases!",
      resourceData: purchases,
    });
  }
);

// @desc   Get all purchase queried
// @route  GET /api/v1/purchase
// @access Private
const getQueriedPurchasesController = expressAsyncController(
  async (
    request: GetQueriedPurchasesRequest,
    response: Response<
      GetQueriedResourceRequestServerResponse<PurchaseServerResponseDocument>
    >
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalPurchasesService({
        filter: filter as FilterQuery<PurchaseDocument> | undefined,
      });
    }

    const purchases = await getQueriedPurchasesService({
      filter: filter as FilterQuery<PurchaseDocument> | undefined,
      projection: projection as QueryOptions<PurchaseDocument>,
      options: options as QueryOptions<PurchaseDocument>,
    });

    if (!purchases.length) {
      response.status(200).json({
        message: "No purchases that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    const purchasedProducts = await Promise.all(
      purchases.map(async (purchase) => {
        const { products } = purchase;

        const productCategoryDocs = await Promise.all(
          products.map(async (product) => {
            const { productCategory, productId } = product;
            const productCategoryDoc = await PRODUCT_CATEGORY_SERVICE_MAP[
              productCategory
            ](productId);

            return productCategoryDoc;
          })
        );

        // wait for all productCategoryDocs to resolve
        const productCategoryDocsResolved = await Promise.all(productCategoryDocs);

        return productCategoryDocsResolved.filter(removeUndefinedAndNullValues);
      })
    );

    const purchaseResponseArray = purchases.map((purchase, index) => {
      const products = purchasedProducts[index];

      return {
        ...purchase,
        productCategoryDocs: products,
      };
    });

    response.status(200).json({
      message: "Successfully found purchases",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: purchaseResponseArray,
    });
  }
);

// @desc   Get all purchase queried by a user
// @route  GET /api/v1/purchase/user
// @access Private
const getQueriedPurchasesByUserController = expressAsyncController(
  async (
    request: GetQueriedPurchasesByUserRequest,
    response: Response<
      GetQueriedResourceRequestServerResponse<PurchaseServerResponseDocument>
    >
  ) => {
    let { newQueryFlag, totalDocuments, userToBeQueriedId } = request.body;

    let { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    filter = { ...filter, userId: userToBeQueriedId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalPurchasesService({
        filter: filter as FilterQuery<PurchaseDocument> | undefined,
      });
    }

    const purchases = await getQueriedPurchasesService({
      filter: filter as FilterQuery<PurchaseDocument> | undefined,
      projection: projection as QueryOptions<PurchaseDocument>,
      options: options as QueryOptions<PurchaseDocument>,
    });

    if (!purchases.length) {
      response.status(200).json({
        message: "No purchases that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    const purchasedProducts = await Promise.all(
      purchases.map(async (purchase) => {
        const { products } = purchase;

        const productCategoryDocs = await Promise.all(
          products.map(async (product) => {
            const { productCategory, productId } = product;
            const productCategoryDoc = await PRODUCT_CATEGORY_SERVICE_MAP[
              productCategory
            ](productId);

            return productCategoryDoc;
          })
        );

        // wait for all productCategoryDocs to resolve
        const productCategoryDocsResolved = await Promise.all(productCategoryDocs);

        return productCategoryDocsResolved.filter(removeUndefinedAndNullValues);
      })
    );

    const purchaseResponseArray = purchases.map((purchase, index) => {
      const products = purchasedProducts[index];

      return {
        ...purchase,
        productCategoryDocs: products,
      };
    });

    response.status(200).json({
      message: "Successfully found purchases",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: purchaseResponseArray,
    });
  }
);

// @desc   Get a purchase by id
// @route  GET /api/v1/purchase/:id
// @access Private
const getPurchaseByIdController = expressAsyncController(
  async (
    request: GetPurchaseByIdRequest,
    response: Response<ResourceRequestServerResponse<PurchaseServerResponseDocument>>,
    next: NextFunction
  ) => {
    const { purchaseId } = request.params;

    const purchaseDocument = await getPurchaseByIdService(purchaseId);
    if (!purchaseDocument) {
      return next(new createHttpError.NotFound("Purchase not found"));
    }

    const productCategoryDocs = await Promise.all(
      purchaseDocument.products.map(async (product) => {
        const { productCategory, productId } = product;
        const productCategoryDoc = await PRODUCT_CATEGORY_SERVICE_MAP[productCategory](
          productId
        );

        return productCategoryDoc;
      })
    );

    const purchaseResponseDoc = {
      ...purchaseDocument,
      productCategoryDocs: productCategoryDocs.filter(removeUndefinedAndNullValues),
    };

    response.status(200).json({
      message: "Successfully found purchases data!",
      resourceData: [purchaseResponseDoc],
    });
  }
);

// @desc   Delete a purchase
// @route  DELETE /api/v1/purchase
// @access Private
const deletePurchaseController = expressAsyncController(
  async (
    request: DeleteAPurchaseRequest,
    response: Response<ResourceRequestServerResponse<PurchaseDocument>>,
    next: NextFunction
  ) => {
    const { purchaseId } = request.params;

    const deletedPurchase = await deleteAPurchaseService(purchaseId);
    if (!deletedPurchase.deletedCount) {
      return next(new createHttpError.InternalServerError("Failed to delete purchase"));
    }

    response.status(200).json({
      message: "Successfully deleted product review!",
      resourceData: [],
    });
  }
);

// @desc   Update a purchase
// @route  PATCH /api/v1/purchase
// @access Private
const updatePurchaseByIdController = expressAsyncController(
  async (
    request: UpdatePurchaseByIdRequest,
    response: Response<ResourceRequestServerResponse<PurchaseServerResponseDocument>>,
    next: NextFunction
  ) => {
    const { purchaseId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedPurchase = await updatePurchaseByIdService({
      _id: purchaseId,
      fields,
      updateOperator,
    });

    if (!updatedPurchase) {
      return next(new createHttpError.InternalServerError("Failed to update purchase"));
    }

    const productCategoryDocs = await Promise.all(
      updatedPurchase.products.map(async (product) => {
        const { productCategory, productId } = product;
        const productCategoryDoc = await PRODUCT_CATEGORY_SERVICE_MAP[productCategory](
          productId
        );

        return productCategoryDoc;
      })
    );

    const purchaseResponseDoc = {
      ...updatedPurchase,
      productCategoryDocs: productCategoryDocs.filter(removeUndefinedAndNullValues),
    };

    response.status(200).json({
      message: "Purchase updated successfully",
      resourceData: [purchaseResponseDoc],
    });
  }
);

// @desc   Delete all purchases
// @route  DELETE /api/v1/purchase/delete-all
// @access Private
const deleteAllPurchasesController = expressAsyncController(
  async (
    request: DeleteAllPurchasesRequest,
    response: Response<ResourceRequestServerResponse<PurchaseDocument>>,
    next: NextFunction
  ) => {
    const deletedPurchases = await deleteAllPurchasesService();
    if (!deletedPurchases.deletedCount) {
      return next(new createHttpError.InternalServerError("Failed to delete purchases"));
    }

    response.status(200).json({
      message: "Successfully deleted purchases!",
      resourceData: [],
    });
  }
);

export {
  updatePurchasesBulkController,
  createNewPurchaseController,
  createNewPurchasesBulkController,
  deleteAllPurchasesController,
  deletePurchaseController,
  getAllPurchasesBulkController,
  getPurchaseByIdController,
  getQueriedPurchasesController,
  getQueriedPurchasesByUserController,
  updatePurchaseByIdController,
};
