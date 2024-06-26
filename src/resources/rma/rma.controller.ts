import expressAsyncController from "express-async-handler";

import type { NextFunction, Response } from "express";
import type {
  CreateNewRMAsBulkRequest,
  CreateNewRMARequest,
  DeleteARMARequest,
  DeleteAllRMAsRequest,
  GetRMAByIdRequest,
  GetQueriedRMAsByUserRequest,
  GetQueriedRMAsRequest,
  UpdateRMAByIdRequest,
  UpdateRMAsBulkRequest,
  GetAllRMAsBulkRequest,
  RMAServerResponseDocument,
} from "./rma.types";

import {
  createNewRMAService,
  deleteARMAService,
  deleteAllRMAsService,
  getAllRMAsService,
  getRMAByIdService,
  getQueriedRMAsService,
  getQueriedTotalRMAsService,
  updateRMAByIdService,
} from "./rma.service";
import { RMADocument, RMASchema } from "./rma.model";
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
// @route  POST /api/v1/rma
// @access Private
const createNewRMAController = expressAsyncController(
  async (
    request: CreateNewRMARequest,
    response: Response<ResourceRequestServerResponse<RMADocument>>,
    next: NextFunction
  ) => {
    const {
      userInfo: { userId },
      rmaFields,
    } = request.body;

    const rmaSchema: RMASchema = {
      ...rmaFields,
      customerId: userId,
    };

    const rmaDocument: RMADocument = await createNewRMAService(rmaSchema);
    if (!rmaDocument) {
      return next(new createHttpError.InternalServerError("Failed to create new rma"));
    }

    response.status(201).json({
      message: "RMA created successfully",
      resourceData: [rmaDocument],
    });
  }
);

// DEV ROUTE
// @desc   create new rma in bulk
// @route  POST /api/v1/rma/dev
// @access Private
const createNewRMAsBulkController = expressAsyncController(
  async (
    request: CreateNewRMAsBulkRequest,
    response: Response<ResourceRequestServerResponse<RMADocument>>,
    next: NextFunction
  ) => {
    const { rmaSchemas } = request.body;

    const rmaDocuments = await Promise.all(
      rmaSchemas.map(async (rmaSchema) => {
        const rmaDocument: RMADocument = await createNewRMAService(rmaSchema);
        return rmaDocument;
      })
    );

    const successfullyCreatedRMAs = rmaDocuments.filter(removeUndefinedAndNullValues);

    if (successfullyCreatedRMAs.length === rmaSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedRMAs.length} RMAs`,
        resourceData: successfullyCreatedRMAs,
      });
      return;
    }

    if (successfullyCreatedRMAs.length === 0) {
      response.status(400).json({
        message: "Could not create any RMAs",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        rmaSchemas.length - successfullyCreatedRMAs.length
      } RMAs`,
      resourceData: successfullyCreatedRMAs,
    });
    return;
  }
);

// DEV ROUTE
// @desc   Add field to all rma
// @route  PATCH /api/v1/rma/dev
// @access Private
const updateRMAsBulkController = expressAsyncController(
  async (
    request: UpdateRMAsBulkRequest,
    response: Response<ResourceRequestServerResponse<RMADocument>>,
    next: NextFunction
  ) => {
    const { rmaFields } = request.body;

    const updatedRMAs = await Promise.all(
      rmaFields.map(async (rmaField) => {
        const {
          documentUpdate: { fields, updateOperator },
          rmaId,
        } = rmaField;

        const updatedRMA = await updateRMAByIdService({
          _id: rmaId,
          fields,
          updateOperator,
        });

        return updatedRMA;
      })
    );

    const successfullyCreatedRMAs = updatedRMAs.filter(removeUndefinedAndNullValues);

    if (successfullyCreatedRMAs.length === rmaFields.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedRMAs.length} RMAs`,
        resourceData: successfullyCreatedRMAs,
      });
      return;
    }

    if (successfullyCreatedRMAs.length === 0) {
      response.status(400).json({
        message: "Could not create any RMAs",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        rmaFields.length - successfullyCreatedRMAs.length
      } RMAs`,
      resourceData: successfullyCreatedRMAs,
    });
    return;
  }
);

// DEV ROUTE
// @desc   get all rma bulk (no filter, projection or options)
// @route  GET /api/v1/rma/dev
// @access Private
const getAllRMAsBulkController = expressAsyncController(
  async (
    request: GetAllRMAsBulkRequest,
    response: Response<ResourceRequestServerResponse<RMADocument>>,
    next: NextFunction
  ) => {
    const rma = await getAllRMAsService();

    if (!rma.length) {
      response.status(200).json({
        message: "Unable to find any rmas",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully found rmas!",
      resourceData: rma,
    });
  }
);

// @desc   Get all rma queried
// @route  GET /api/v1/rma
// @access Private
const getQueriedRMAsController = expressAsyncController(
  async (
    request: GetQueriedRMAsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RMAServerResponseDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRMAsService({
        filter: filter as FilterQuery<RMADocument> | undefined,
      });
    }

    const rmas = await getQueriedRMAsService({
      filter: filter as FilterQuery<RMADocument> | undefined,
      projection: projection as QueryOptions<RMADocument>,
      options: options as QueryOptions<RMADocument>,
    });

    if (!rmas.length) {
      response.status(200).json({
        message: "No rmas that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    const rmadProducts = await Promise.all(
      rmas.map(async (rma) => {
        const { productId, productCategory } = rma;

        const productCategoryDoc = await PRODUCT_CATEGORY_SERVICE_MAP[productCategory](
          productId
        );

        return productCategoryDoc;
      })
    );

    const rmaResponseArray = rmas.map((rma, index) => {
      const products = rmadProducts[index];

      return {
        ...rma,
        productCategoryDocs: [products],
      };
    });

    response.status(200).json({
      message: "Successfully found rmas",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: rmaResponseArray,
    });
  }
);

// @desc   Get all rma queried by a user
// @route  GET /api/v1/rma/user
// @access Private
const getQueriedRMAsByUserController = expressAsyncController(
  async (
    request: GetQueriedRMAsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RMAServerResponseDocument>>
  ) => {
    let { newQueryFlag, totalDocuments, userToBeQueriedId } = request.body;

    let { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    filter = { ...filter, userId: userToBeQueriedId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRMAsService({
        filter: filter as FilterQuery<RMADocument> | undefined,
      });
    }

    const rmas = await getQueriedRMAsService({
      filter: filter as FilterQuery<RMADocument> | undefined,
      projection: projection as QueryOptions<RMADocument>,
      options: options as QueryOptions<RMADocument>,
    });

    if (!rmas.length) {
      response.status(200).json({
        message: "No rmas that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    const rmadProducts = await Promise.all(
      rmas.map(async (rma) => {
        const { productId, productCategory } = rma;

        const productCategoryDoc = await PRODUCT_CATEGORY_SERVICE_MAP[productCategory](
          productId
        );

        return productCategoryDoc;
      })
    );

    const rmaResponseArray = rmas.map((rma, index) => {
      const products = rmadProducts[index];

      return {
        ...rma,
        productCategoryDocs: [products],
      };
    });

    response.status(200).json({
      message: "Successfully found rmas",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: rmaResponseArray,
    });
  }
);

// @desc   Get a rma by id
// @route  GET /api/v1/rma/:id
// @access Private
const getRMAByIdController = expressAsyncController(
  async (
    request: GetRMAByIdRequest,
    response: Response<ResourceRequestServerResponse<RMAServerResponseDocument>>,
    next: NextFunction
  ) => {
    const { rmaId } = request.params;

    const rmaDocument = await getRMAByIdService(rmaId);
    if (!rmaDocument) {
      return next(new createHttpError.NotFound("RMA not found"));
    }

    const { productCategory, productId } = rmaDocument;

    const productCategoryDoc = await PRODUCT_CATEGORY_SERVICE_MAP[productCategory](
      productId
    );

    const rmaResponseDoc = {
      ...rmaDocument,
      productCategoryDoc,
    };

    response.status(200).json({
      message: "Successfully found rmas data!",
      resourceData: [rmaResponseDoc],
    });
  }
);

// @desc   Delete a rma
// @route  DELETE /api/v1/rma
// @access Private
const deleteRMAController = expressAsyncController(
  async (
    request: DeleteARMARequest,
    response: Response<ResourceRequestServerResponse<RMADocument>>,
    next: NextFunction
  ) => {
    const { rmaId } = request.params;

    const deletedRMA = await deleteARMAService(rmaId);
    if (!deletedRMA.deletedCount) {
      return next(new createHttpError.InternalServerError("Failed to delete rma"));
    }

    response.status(200).json({
      message: "Successfully deleted product review!",
      resourceData: [],
    });
  }
);

// @desc   Update a rma
// @route  PATCH /api/v1/rma
// @access Private
const updateRMAByIdController = expressAsyncController(
  async (
    request: UpdateRMAByIdRequest,
    response: Response<ResourceRequestServerResponse<RMAServerResponseDocument>>,
    next: NextFunction
  ) => {
    const { rmaId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedRMA = await updateRMAByIdService({
      _id: rmaId,
      fields,
      updateOperator,
    });

    if (!updatedRMA) {
      return next(new createHttpError.InternalServerError("Failed to update rma"));
    }

    const { productCategory, productId } = updatedRMA;

    const productCategoryDoc = await PRODUCT_CATEGORY_SERVICE_MAP[productCategory](
      productId
    );

    const rmaResponseDoc = {
      ...updatedRMA,
      productCategoryDoc,
    };

    response.status(200).json({
      message: "RMA updated successfully",
      resourceData: [rmaResponseDoc],
    });
  }
);

// @desc   Delete all rmas
// @route  DELETE /api/v1/rma/delete-all
// @access Private
const deleteAllRMAsController = expressAsyncController(
  async (
    _request: DeleteAllRMAsRequest,
    response: Response<ResourceRequestServerResponse<RMADocument>>,
    next: NextFunction
  ) => {
    const deletedRMAs = await deleteAllRMAsService();
    if (!deletedRMAs.deletedCount) {
      return next(new createHttpError.InternalServerError("Failed to delete rmas"));
    }

    response.status(200).json({
      message: "Successfully deleted rmas!",
      resourceData: [],
    });
  }
);

export {
  updateRMAsBulkController,
  createNewRMAController,
  createNewRMAsBulkController,
  deleteAllRMAsController,
  deleteRMAController,
  getAllRMAsBulkController,
  getRMAByIdController,
  getQueriedRMAsController,
  getQueriedRMAsByUserController,
  updateRMAByIdController,
};
