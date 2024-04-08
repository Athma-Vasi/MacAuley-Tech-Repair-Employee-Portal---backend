import expressAsyncHandler from "express-async-handler";

import type { Response } from "express";
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
  getQueriedRMAsByUserService,
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

// @desc   Create new user
// @route  POST /api/v1/rma
// @access Private
const createNewRMAHandler = expressAsyncHandler(
  async (
    request: CreateNewRMARequest,
    response: Response<ResourceRequestServerResponse<RMADocument>>
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
      response.status(400).json({
        message: "RMA creation failed",
        resourceData: [],
      });
      return;
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
const createNewRMAsBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewRMAsBulkRequest,
    response: Response<ResourceRequestServerResponse<RMADocument>>
  ) => {
    const { rmaSchemas } = request.body;

    const rmaDocuments = await Promise.all(
      rmaSchemas.map(async (rmaSchema) => {
        const rmaDocument: RMADocument = await createNewRMAService(rmaSchema);
        return rmaDocument;
      })
    );

    // filter out any rma that were not created
    const successfullyCreatedRMAs = rmaDocuments.filter(removeUndefinedAndNullValues);

    // check if any rma were created
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
const updateRMAsBulkHandler = expressAsyncHandler(
  async (
    request: UpdateRMAsBulkRequest,
    response: Response<ResourceRequestServerResponse<RMADocument>>
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

    // filter out any rma that were not created
    const successfullyCreatedRMAs = updatedRMAs.filter(removeUndefinedAndNullValues);

    // check if any rma were created
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
const getAllRMAsBulkHandler = expressAsyncHandler(
  async (
    request: GetAllRMAsBulkRequest,
    response: Response<ResourceRequestServerResponse<RMADocument>>
  ) => {
    const rma = await getAllRMAsService();

    if (!rma.length) {
      response.status(200).json({
        message: "Unable to find any rmas. Please try again!",
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
const getQueriedRMAsHandler = expressAsyncHandler(
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

    // get all rma
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
const getQueriedRMAsByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedRMAsByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RMAServerResponseDocument>>
  ) => {
    let { newQueryFlag, totalDocuments, userToBeQueriedId } = request.body;

    let { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // assign userToBeQueriedId to filter
    filter = { ...filter, userId: userToBeQueriedId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRMAsService({
        filter: filter as FilterQuery<RMADocument> | undefined,
      });
    }

    // get all rma
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
const getRMAByIdHandler = expressAsyncHandler(
  async (
    request: GetRMAByIdRequest,
    response: Response<ResourceRequestServerResponse<RMAServerResponseDocument>>
  ) => {
    const { rmaId } = request.params;

    const rmaDocument = await getRMAByIdService(rmaId);

    if (!rmaDocument) {
      response.status(404).json({ message: "RMA not found.", resourceData: [] });
      return;
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
const deleteRMAHandler = expressAsyncHandler(
  async (
    request: DeleteARMARequest,
    response: Response<ResourceRequestServerResponse<RMADocument>>
  ) => {
    const { rmaId } = request.params;

    const deletedRMA = await deleteARMAService(rmaId);

    if (!deletedRMA.acknowledged) {
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

// @desc   Update a rma
// @route  PATCH /api/v1/rma
// @access Private
const updateRMAByIdHandler = expressAsyncHandler(
  async (
    request: UpdateRMAByIdRequest,
    response: Response<ResourceRequestServerResponse<RMAServerResponseDocument>>
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
      response.status(400).json({ message: "RMA update failed", resourceData: [] });
      return;
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
const deleteAllRMAsHandler = expressAsyncHandler(
  async (
    request: DeleteAllRMAsRequest,
    response: Response<ResourceRequestServerResponse<RMADocument>>
  ) => {
    const deletedRMAs = await deleteAllRMAsService();

    if (!deletedRMAs.acknowledged) {
      response.status(400).json({
        message: "Failed to delete rmas. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully deleted rmas!",
      resourceData: [],
    });
  }
);

export {
  updateRMAsBulkHandler,
  createNewRMAHandler,
  createNewRMAsBulkHandler,
  deleteAllRMAsHandler,
  deleteRMAHandler,
  getAllRMAsBulkHandler,
  getRMAByIdHandler,
  getQueriedRMAsHandler,
  getQueriedRMAsByUserHandler,
  updateRMAByIdHandler,
};
