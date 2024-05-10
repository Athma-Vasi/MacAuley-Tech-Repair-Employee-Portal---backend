import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewRamBulkRequest,
  CreateNewRamRequest,
  DeleteARamRequest,
  DeleteAllRamsRequest,
  GetRamByIdRequest,
  GetQueriedRamsRequest,
  UpdateRamByIdRequest,
  UpdateRamsBulkRequest,
} from "./ram.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { RamDocument } from "./ram.model";

import {
  createNewRamService,
  deleteARamService,
  deleteAllRamsService,
  getRamByIdService,
  getQueriedRamsService,
  getQueriedTotalRamsService,
  returnAllRamsUploadedFileIdsService,
  updateRamByIdService,
} from "./ram.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new ram
// @route  POST /api/v1/product-category/ram
// @access Private/Admin/Manager
const createNewRamController = expressAsyncController(
  async (
    request: CreateNewRamRequest,
    response: Response<ResourceRequestServerResponse<RamDocument>>,
    next: NextFunction
  ) => {
    const { ramSchema } = request.body;

    const ramDocument: RamDocument = await createNewRamService(ramSchema);
    if (!ramDocument) {
      return next(new createHttpError.InternalServerError("Ram could not be created"));
    }

    response.status(201).json({
      message: `Successfully created new ${ramDocument.model} ram`,
      resourceData: [ramDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new rams bulk
// @route  POST /api/v1/product-category/ram/dev
// @access Private/Admin/Manager
const createNewRamBulkController = expressAsyncController(
  async (
    request: CreateNewRamBulkRequest,
    response: Response<ResourceRequestServerResponse<RamDocument>>,
    next: NextFunction
  ) => {
    const { ramSchemas } = request.body;

    const newRams = await Promise.all(
      ramSchemas.map(async (ramSchema) => {
        const newRam = await createNewRamService(ramSchema);
        return newRam;
      })
    );

    const successfullyCreatedRams = newRams.filter((ram) => ram);

    if (successfullyCreatedRams.length === ramSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedRams.length} rams`,
        resourceData: successfullyCreatedRams,
      });
      return;
    }

    if (successfullyCreatedRams.length === 0) {
      response.status(400).json({
        message: "Could not create any rams",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        ramSchemas.length - successfullyCreatedRams.length
      } rams`,
      resourceData: successfullyCreatedRams,
    });
    return;
  }
);

// @desc   Update rams bulk
// @route  PATCH /api/v1/product-category/ram/dev
// @access Private/Admin/Manager
const updateRamsBulkController = expressAsyncController(
  async (
    request: UpdateRamsBulkRequest,
    response: Response<ResourceRequestServerResponse<RamDocument>>,
    next: NextFunction
  ) => {
    const { ramFields } = request.body;

    const updatedRams = await Promise.all(
      ramFields.map(async (ramField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = ramField;

        const updatedRam = await updateRamByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedRam;
      })
    );

    const successfullyUpdatedRams = updatedRams.filter(removeUndefinedAndNullValues);

    if (successfullyUpdatedRams.length === ramFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedRams.length} rams`,
        resourceData: successfullyUpdatedRams,
      });
      return;
    }

    if (successfullyUpdatedRams.length === 0) {
      response.status(400).json({
        message: "Could not update any rams",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        ramFields.length - successfullyUpdatedRams.length
      } rams`,
      resourceData: successfullyUpdatedRams,
    });
    return;
  }
);

// @desc   Get all rams
// @route  GET /api/v1/product-category/ram
// @access Private/Admin/Manager
const getQueriedRamsController = expressAsyncController(
  async (
    request: GetQueriedRamsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<RamDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalRamsService({
        filter: filter as FilterQuery<RamDocument> | undefined,
      });
    }

    const rams = await getQueriedRamsService({
      filter: filter as FilterQuery<RamDocument> | undefined,
      projection: projection as QueryOptions<RamDocument>,
      options: options as QueryOptions<RamDocument>,
    });

    if (rams.length === 0) {
      response.status(200).json({
        message: "No rams that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved rams",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: rams,
    });
  }
);

// @desc   Get ram by id
// @route  GET /api/v1/product-category/ram/:ramId
// @access Private/Admin/Manager
const getRamByIdController = expressAsyncController(
  async (
    request: GetRamByIdRequest,
    response: Response<ResourceRequestServerResponse<RamDocument>>,
    next: NextFunction
  ) => {
    const ramId = request.params.ramId;

    const ram = await getRamByIdService(ramId);
    if (!ram) {
      return next(new createHttpError.NotFound("Ram does not exist"));
    }

    response.status(200).json({
      message: "Successfully retrieved ram",
      resourceData: [ram],
    });
  }
);

// @desc   Update a ram by id
// @route  PUT /api/v1/product-category/ram/:ramId
// @access Private/Admin/Manager
const updateRamByIdController = expressAsyncController(
  async (
    request: UpdateRamByIdRequest,
    response: Response<ResourceRequestServerResponse<RamDocument>>,
    next: NextFunction
  ) => {
    const { ramId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedRam = await updateRamByIdService({
      _id: ramId,
      fields,
      updateOperator,
    });

    if (!updatedRam) {
      return next(new createHttpError.InternalServerError("Ram could not be updated"));
    }

    response.status(200).json({
      message: "Ram updated successfully",
      resourceData: [updatedRam],
    });
  }
);

// @desc   Delete all rams
// @route  DELETE /api/v1/product-category/ram
// @access Private/Admin/Manager
const deleteAllRamsController = expressAsyncController(
  async (
    _request: DeleteAllRamsRequest,
    response: Response<ResourceRequestServerResponse<RamDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllRamsUploadedFileIdsService();

    const deletedFileUploads = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId)
      )
    );

    if (
      deletedFileUploads.some((deletedFileUpload) => deletedFileUpload.deletedCount === 0)
    ) {
      return next(
        new createHttpError.InternalServerError("Some file uploads could not be deleted")
      );
    }

    const deletedReviews = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteAProductReviewService(fileUploadId)
      )
    );

    if (deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)) {
      return next(
        new createHttpError.InternalServerError("Some reviews could not be deleted")
      );
    }

    const deleteRamsResult: DeleteResult = await deleteAllRamsService();
    if (deleteRamsResult.deletedCount === 0) {
      return next(new createHttpError.InternalServerError("Rams could not be deleted"));
    }

    response.status(200).json({ message: "All rams deleted", resourceData: [] });
  }
);

// @desc   Delete a ram by id
// @route  DELETE /api/v1/product-category/ram/:ramId
// @access Private/Admin/Manager
const deleteARamController = expressAsyncController(
  async (
    request: DeleteARamRequest,
    response: Response<ResourceRequestServerResponse<RamDocument>>,
    next: NextFunction
  ) => {
    const ramId = request.params.ramId;

    const ramExists = await getRamByIdService(ramId);
    if (!ramExists) {
      response.status(404).json({ message: "Ram does not exist", resourceData: [] });
      return;
    }

    const uploadedFilesIds = [...ramExists.uploadedFilesIds];

    const deletedFileUploads = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId)
      )
    );

    if (
      deletedFileUploads.some((deletedFileUpload) => deletedFileUpload.deletedCount === 0)
    ) {
      return next(
        new createHttpError.InternalServerError("Some file uploads could not be deleted")
      );
    }

    const deletedReviews = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteAProductReviewService(fileUploadId)
      )
    );

    if (deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)) {
      return next(
        new createHttpError.InternalServerError("Some reviews could not be deleted")
      );
    }

    const deleteRamResult: DeleteResult = await deleteARamService(ramId);
    if (deleteRamResult.deletedCount === 0) {
      return next(new createHttpError.InternalServerError("Ram could not be deleted"));
    }

    response.status(200).json({ message: "Ram deleted", resourceData: [] });
  }
);

export {
  createNewRamBulkController,
  createNewRamController,
  deleteARamController,
  deleteAllRamsController,
  getRamByIdController,
  getQueriedRamsController,
  updateRamByIdController,
  updateRamsBulkController,
};
