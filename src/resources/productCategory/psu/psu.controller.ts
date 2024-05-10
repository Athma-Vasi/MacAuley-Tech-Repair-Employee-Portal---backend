import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewPsuBulkRequest,
  CreateNewPsuRequest,
  DeleteAPsuRequest,
  DeleteAllPsusRequest,
  GetPsuByIdRequest,
  GetQueriedPsusRequest,
  UpdatePsuByIdRequest,
  UpdatePsusBulkRequest,
} from "./psu.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { PsuDocument } from "./psu.model";

import {
  createNewPsuService,
  deleteAPsuService,
  deleteAllPsusService,
  getPsuByIdService,
  getQueriedPsusService,
  getQueriedTotalPsusService,
  returnAllPsusUploadedFileIdsService,
  updatePsuByIdService,
} from "./psu.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new psu
// @route  POST /api/v1/product-category/psu
// @access Private/Admin/Manager
const createNewPsuController = expressAsyncController(
  async (
    request: CreateNewPsuRequest,
    response: Response<ResourceRequestServerResponse<PsuDocument>>,
    next: NextFunction
  ) => {
    const { psuSchema } = request.body;

    const psuDocument: PsuDocument = await createNewPsuService(psuSchema);
    if (!psuDocument) {
      return next(new createHttpError.InternalServerError("Psu could not be created"));
    }

    response.status(201).json({
      message: `Successfully created new ${psuDocument.model} psu`,
      resourceData: [psuDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new psus bulk
// @route  POST /api/v1/product-category/psu/dev
// @access Private/Admin/Manager
const createNewPsuBulkController = expressAsyncController(
  async (
    request: CreateNewPsuBulkRequest,
    response: Response<ResourceRequestServerResponse<PsuDocument>>,
    next: NextFunction
  ) => {
    const { psuSchemas } = request.body;

    const newPsus = await Promise.all(
      psuSchemas.map(async (psuSchema) => {
        const newPsu = await createNewPsuService(psuSchema);
        return newPsu;
      })
    );

    const successfullyCreatedPsus = newPsus.filter((psu) => psu);

    if (successfullyCreatedPsus.length === psuSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedPsus.length} psus`,
        resourceData: successfullyCreatedPsus,
      });
      return;
    }

    if (successfullyCreatedPsus.length === 0) {
      response.status(400).json({
        message: "Could not create any psus",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        psuSchemas.length - successfullyCreatedPsus.length
      } psus`,
      resourceData: successfullyCreatedPsus,
    });
    return;
  }
);

// @desc   Update psus bulk
// @route  PATCH /api/v1/product-category/psu/dev
// @access Private/Admin/Manager
const updatePsusBulkController = expressAsyncController(
  async (
    request: UpdatePsusBulkRequest,
    response: Response<ResourceRequestServerResponse<PsuDocument>>,
    next: NextFunction
  ) => {
    const { psuFields } = request.body;

    const updatedPsus = await Promise.all(
      psuFields.map(async (psuField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = psuField;

        const updatedPsu = await updatePsuByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedPsu;
      })
    );

    const successfullyUpdatedPsus = updatedPsus.filter(removeUndefinedAndNullValues);

    if (successfullyUpdatedPsus.length === psuFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedPsus.length} psus`,
        resourceData: successfullyUpdatedPsus,
      });
      return;
    }

    if (successfullyUpdatedPsus.length === 0) {
      response.status(400).json({
        message: "Could not update any psus",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        psuFields.length - successfullyUpdatedPsus.length
      } psus`,
      resourceData: successfullyUpdatedPsus,
    });
    return;
  }
);

// @desc   Get all psus
// @route  GET /api/v1/product-category/psu
// @access Private/Admin/Manager
const getQueriedPsusController = expressAsyncController(
  async (
    request: GetQueriedPsusRequest,
    response: Response<GetQueriedResourceRequestServerResponse<PsuDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalPsusService({
        filter: filter as FilterQuery<PsuDocument> | undefined,
      });
    }

    const psus = await getQueriedPsusService({
      filter: filter as FilterQuery<PsuDocument> | undefined,
      projection: projection as QueryOptions<PsuDocument>,
      options: options as QueryOptions<PsuDocument>,
    });

    if (psus.length === 0) {
      response.status(200).json({
        message: "No psus that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved psus",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: psus,
    });
  }
);

// @desc   Get psu by id
// @route  GET /api/v1/product-category/psu/:psuId
// @access Private/Admin/Manager
const getPsuByIdController = expressAsyncController(
  async (
    request: GetPsuByIdRequest,
    response: Response<ResourceRequestServerResponse<PsuDocument>>,
    next: NextFunction
  ) => {
    const psuId = request.params.psuId;

    const psu = await getPsuByIdService(psuId);
    if (!psu) {
      return next(new createHttpError.NotFound("Psu does not exist"));
    }

    response.status(200).json({
      message: "Successfully retrieved psu",
      resourceData: [psu],
    });
  }
);

// @desc   Update a psu by id
// @route  PUT /api/v1/product-category/psu/:psuId
// @access Private/Admin/Manager
const updatePsuByIdController = expressAsyncController(
  async (
    request: UpdatePsuByIdRequest,
    response: Response<ResourceRequestServerResponse<PsuDocument>>,
    next: NextFunction
  ) => {
    const { psuId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedPsu = await updatePsuByIdService({
      _id: psuId,
      fields,
      updateOperator,
    });

    if (!updatedPsu) {
      return next(new createHttpError.InternalServerError("Psu could not be updated"));
    }

    response.status(200).json({
      message: "Psu updated successfully",
      resourceData: [updatedPsu],
    });
  }
);

// @desc   Delete all psus
// @route  DELETE /api/v1/product-category/psu
// @access Private/Admin/Manager
const deleteAllPsusController = expressAsyncController(
  async (
    _request: DeleteAllPsusRequest,
    response: Response<ResourceRequestServerResponse<PsuDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllPsusUploadedFileIdsService();

    const deletedFileUploads = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId)
      )
    );

    if (
      deletedFileUploads.some((deletedFileUpload) => deletedFileUpload.deletedCount === 0)
    ) {
      return next(
        new createHttpError.InternalServerError("Could not delete all file uploads")
      );
    }

    const deletedReviews = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteAProductReviewService(fileUploadId)
      )
    );

    if (deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)) {
      return next(
        new createHttpError.InternalServerError("Could not delete all reviews")
      );
    }

    const deletePsusResult: DeleteResult = await deleteAllPsusService();
    if (deletePsusResult.deletedCount === 0) {
      return next(new createHttpError.InternalServerError("Could not delete all psus"));
    }

    response.status(200).json({ message: "All psus deleted", resourceData: [] });
  }
);

// @desc   Delete a psu by id
// @route  DELETE /api/v1/product-category/psu/:psuId
// @access Private/Admin/Manager
const deleteAPsuController = expressAsyncController(
  async (
    request: DeleteAPsuRequest,
    response: Response<ResourceRequestServerResponse<PsuDocument>>,
    next: NextFunction
  ) => {
    const psuId = request.params.psuId;

    const psuExists = await getPsuByIdService(psuId);
    if (!psuExists) {
      response.status(404).json({ message: "Psu does not exist", resourceData: [] });
      return;
    }

    const uploadedFilesIds = [...psuExists.uploadedFilesIds];

    const deletedFileUploads = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId)
      )
    );

    if (
      deletedFileUploads.some((deletedFileUpload) => deletedFileUpload.deletedCount === 0)
    ) {
      return next(
        new createHttpError.InternalServerError("Could not delete all file uploads")
      );
    }

    const deletedReviews = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteAProductReviewService(fileUploadId)
      )
    );

    if (deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)) {
      return next(
        new createHttpError.InternalServerError("Could not delete all reviews")
      );
    }

    const deletePsuResult: DeleteResult = await deleteAPsuService(psuId);
    if (deletePsuResult.deletedCount === 0) {
      return next(new createHttpError.InternalServerError("Could not delete psu"));
    }

    response.status(200).json({ message: "Psu deleted", resourceData: [] });
  }
);

export {
  createNewPsuBulkController,
  createNewPsuController,
  deleteAPsuController,
  deleteAllPsusController,
  getPsuByIdController,
  getQueriedPsusController,
  updatePsuByIdController,
  updatePsusBulkController,
};
