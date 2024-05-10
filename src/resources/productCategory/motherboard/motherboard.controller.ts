import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewMotherboardBulkRequest,
  CreateNewMotherboardRequest,
  DeleteAMotherboardRequest,
  DeleteAllMotherboardsRequest,
  GetMotherboardByIdRequest,
  GetQueriedMotherboardsRequest,
  UpdateMotherboardByIdRequest,
  UpdateMotherboardsBulkRequest,
} from "./motherboard.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { MotherboardDocument } from "./motherboard.model";

import {
  createNewMotherboardService,
  deleteAMotherboardService,
  deleteAllMotherboardsService,
  getMotherboardByIdService,
  getQueriedMotherboardsService,
  getQueriedTotalMotherboardsService,
  returnAllMotherboardsUploadedFileIdsService,
  updateMotherboardByIdService,
} from "./motherboard.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new motherboard
// @route  POST /api/v1/product-category/motherboard
// @access Private/Admin/Manager
const createNewMotherboardController = expressAsyncController(
  async (
    request: CreateNewMotherboardRequest,
    response: Response<ResourceRequestServerResponse<MotherboardDocument>>,
    next: NextFunction
  ) => {
    const { motherboardSchema } = request.body;

    const motherboardDocument: MotherboardDocument = await createNewMotherboardService(
      motherboardSchema
    );
    if (!motherboardDocument) {
      return next(
        new createHttpError.InternalServerError("Motherboard could not be created")
      );
    }

    response.status(201).json({
      message: `Successfully created new ${motherboardDocument.model} motherboard`,
      resourceData: [motherboardDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new motherboards bulk
// @route  POST /api/v1/product-category/motherboard/dev
// @access Private/Admin/Manager
const createNewMotherboardBulkController = expressAsyncController(
  async (
    request: CreateNewMotherboardBulkRequest,
    response: Response<ResourceRequestServerResponse<MotherboardDocument>>,
    next: NextFunction
  ) => {
    const { motherboardSchemas } = request.body;

    const newMotherboards = await Promise.all(
      motherboardSchemas.map(async (motherboardSchema) => {
        const newMotherboard = await createNewMotherboardService(motherboardSchema);
        return newMotherboard;
      })
    );

    const successfullyCreatedMotherboards = newMotherboards.filter(
      (motherboard) => motherboard
    );

    if (successfullyCreatedMotherboards.length === motherboardSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedMotherboards.length} motherboards`,
        resourceData: successfullyCreatedMotherboards,
      });
      return;
    }

    if (successfullyCreatedMotherboards.length === 0) {
      response.status(400).json({
        message: "Could not create any motherboards",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        motherboardSchemas.length - successfullyCreatedMotherboards.length
      } motherboards`,
      resourceData: successfullyCreatedMotherboards,
    });
    return;
  }
);

// @desc   Update motherboards bulk
// @route  PATCH /api/v1/product-category/motherboard/dev
// @access Private/Admin/Manager
const updateMotherboardsBulkController = expressAsyncController(
  async (
    request: UpdateMotherboardsBulkRequest,
    response: Response<ResourceRequestServerResponse<MotherboardDocument>>,
    next: NextFunction
  ) => {
    const { motherboardFields } = request.body;

    const updatedMotherboards = await Promise.all(
      motherboardFields.map(async (motherboardField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = motherboardField;

        const updatedMotherboard = await updateMotherboardByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedMotherboard;
      })
    );

    const successfullyUpdatedMotherboards = updatedMotherboards.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyUpdatedMotherboards.length === motherboardFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedMotherboards.length} motherboards`,
        resourceData: successfullyUpdatedMotherboards,
      });
      return;
    }

    if (successfullyUpdatedMotherboards.length === 0) {
      response.status(400).json({
        message: "Could not update any motherboards",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        motherboardFields.length - successfullyUpdatedMotherboards.length
      } motherboards`,
      resourceData: successfullyUpdatedMotherboards,
    });
    return;
  }
);

// @desc   Get all motherboards
// @route  GET /api/v1/product-category/motherboard
// @access Private/Admin/Manager
const getQueriedMotherboardsController = expressAsyncController(
  async (
    request: GetQueriedMotherboardsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<MotherboardDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalMotherboardsService({
        filter: filter as FilterQuery<MotherboardDocument> | undefined,
      });
    }

    const motherboards = await getQueriedMotherboardsService({
      filter: filter as FilterQuery<MotherboardDocument> | undefined,
      projection: projection as QueryOptions<MotherboardDocument>,
      options: options as QueryOptions<MotherboardDocument>,
    });

    if (motherboards.length === 0) {
      response.status(200).json({
        message: "No motherboards that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved motherboards",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: motherboards,
    });
  }
);

// @desc   Get motherboard by id
// @route  GET /api/v1/product-category/motherboard/:motherboardId
// @access Private/Admin/Manager
const getMotherboardByIdController = expressAsyncController(
  async (
    request: GetMotherboardByIdRequest,
    response: Response<ResourceRequestServerResponse<MotherboardDocument>>,
    next: NextFunction
  ) => {
    const motherboardId = request.params.motherboardId;

    const motherboard = await getMotherboardByIdService(motherboardId);
    if (!motherboard) {
      return next(new createHttpError.NotFound("Motherboard does not exist"));
    }

    response.status(200).json({
      message: "Successfully retrieved motherboard",
      resourceData: [motherboard],
    });
  }
);

// @desc   Update a motherboard by id
// @route  PUT /api/v1/product-category/motherboard/:motherboardId
// @access Private/Admin/Manager
const updateMotherboardByIdController = expressAsyncController(
  async (
    request: UpdateMotherboardByIdRequest,
    response: Response<ResourceRequestServerResponse<MotherboardDocument>>,
    next: NextFunction
  ) => {
    const { motherboardId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedMotherboard = await updateMotherboardByIdService({
      _id: motherboardId,
      fields,
      updateOperator,
    });

    if (!updatedMotherboard) {
      return next(
        new createHttpError.InternalServerError("Motherboard could not be updated")
      );
    }

    response.status(200).json({
      message: "Motherboard updated successfully",
      resourceData: [updatedMotherboard],
    });
  }
);

// @desc   Delete all motherboards
// @route  DELETE /api/v1/product-category/motherboard
// @access Private/Admin/Manager
const deleteAllMotherboardsController = expressAsyncController(
  async (
    _request: DeleteAllMotherboardsRequest,
    response: Response<ResourceRequestServerResponse<MotherboardDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllMotherboardsUploadedFileIdsService();

    const deletedFileUploads = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId)
      )
    );

    if (
      deletedFileUploads.some((deletedFileUpload) => deletedFileUpload.deletedCount === 0)
    ) {
      return next(
        new createHttpError.InternalServerError(
          "Some file uploads could not be deleted. Please try again."
        )
      );
    }

    const deletedReviews = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteAProductReviewService(fileUploadId)
      )
    );

    if (deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)) {
      return next(
        new createHttpError.InternalServerError(
          "Some product reviews could not be deleted. Please try again."
        )
      );
    }

    const deleteMotherboardsResult: DeleteResult = await deleteAllMotherboardsService();
    if (deleteMotherboardsResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError(
          "Motherboards could not be deleted. Please try again."
        )
      );
    }

    response.status(200).json({ message: "All motherboards deleted", resourceData: [] });
  }
);

// @desc   Delete a motherboard by id
// @route  DELETE /api/v1/product-category/motherboard/:motherboardId
// @access Private/Admin/Manager
const deleteAMotherboardController = expressAsyncController(
  async (
    request: DeleteAMotherboardRequest,
    response: Response<ResourceRequestServerResponse<MotherboardDocument>>,
    next: NextFunction
  ) => {
    const motherboardId = request.params.motherboardId;

    const motherboardExists = await getMotherboardByIdService(motherboardId);
    if (!motherboardExists) {
      return next(new createHttpError.NotFound("Motherboard does not exist"));
    }

    const uploadedFilesIds = [...motherboardExists.uploadedFilesIds];

    const deletedFileUploads = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId)
      )
    );

    if (
      deletedFileUploads.some((deletedFileUpload) => deletedFileUpload.deletedCount === 0)
    ) {
      return next(
        new createHttpError.InternalServerError(
          "Some file uploads could not be deleted. Please try again."
        )
      );
    }

    const deletedReviews = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteAProductReviewService(fileUploadId)
      )
    );

    if (deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)) {
      return next(
        new createHttpError.InternalServerError(
          "Some product reviews could not be deleted. Please try again."
        )
      );
    }

    const deleteMotherboardResult: DeleteResult = await deleteAMotherboardService(
      motherboardId
    );
    if (deleteMotherboardResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError(
          "Motherboard could not be deleted. Please try again."
        )
      );
    }

    response.status(200).json({ message: "Motherboard deleted", resourceData: [] });
  }
);

export {
  createNewMotherboardBulkController,
  createNewMotherboardController,
  deleteAMotherboardController,
  deleteAllMotherboardsController,
  getMotherboardByIdController,
  getQueriedMotherboardsController,
  updateMotherboardByIdController,
  updateMotherboardsBulkController,
};
