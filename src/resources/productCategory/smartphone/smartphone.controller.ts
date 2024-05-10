import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewSmartphoneBulkRequest,
  CreateNewSmartphoneRequest,
  DeleteASmartphoneRequest,
  DeleteAllSmartphonesRequest,
  GetSmartphoneByIdRequest,
  GetQueriedSmartphonesRequest,
  UpdateSmartphoneByIdRequest,
  UpdateSmartphonesBulkRequest,
} from "./smartphone.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { SmartphoneDocument } from "./smartphone.model";

import {
  createNewSmartphoneService,
  deleteASmartphoneService,
  deleteAllSmartphonesService,
  getSmartphoneByIdService,
  getQueriedSmartphonesService,
  getQueriedTotalSmartphonesService,
  returnAllSmartphonesUploadedFileIdsService,
  updateSmartphoneByIdService,
} from "./smartphone.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new smartphone
// @route  POST /api/v1/product-category/smartphone
// @access Private/Admin/Manager
const createNewSmartphoneController = expressAsyncController(
  async (
    request: CreateNewSmartphoneRequest,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>,
    next: NextFunction
  ) => {
    const { smartphoneSchema } = request.body;

    const smartphoneDocument: SmartphoneDocument = await createNewSmartphoneService(
      smartphoneSchema
    );
    if (!smartphoneDocument) {
      return next(
        new createHttpError.InternalServerError("Smartphone could not be created")
      );
    }

    response.status(201).json({
      message: `Successfully created new ${smartphoneDocument.model} smartphone`,
      resourceData: [smartphoneDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new smartphones bulk
// @route  POST /api/v1/product-category/smartphone/dev
// @access Private/Admin/Manager
const createNewSmartphoneBulkController = expressAsyncController(
  async (
    request: CreateNewSmartphoneBulkRequest,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>,
    next: NextFunction
  ) => {
    const { smartphoneSchemas } = request.body;

    const newSmartphones = await Promise.all(
      smartphoneSchemas.map(async (smartphoneSchema) => {
        const newSmartphone = await createNewSmartphoneService(smartphoneSchema);
        return newSmartphone;
      })
    );

    const successfullyCreatedSmartphones = newSmartphones.filter(
      (smartphone) => smartphone
    );

    if (successfullyCreatedSmartphones.length === smartphoneSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedSmartphones.length} smartphones`,
        resourceData: successfullyCreatedSmartphones,
      });
      return;
    }

    if (successfullyCreatedSmartphones.length === 0) {
      response.status(400).json({
        message: "Could not create any smartphones",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        smartphoneSchemas.length - successfullyCreatedSmartphones.length
      } smartphones`,
      resourceData: successfullyCreatedSmartphones,
    });
    return;
  }
);

// @desc   Update smartphones bulk
// @route  PATCH /api/v1/product-category/smartphone/dev
// @access Private/Admin/Manager
const updateSmartphonesBulkController = expressAsyncController(
  async (
    request: UpdateSmartphonesBulkRequest,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>,
    next: NextFunction
  ) => {
    const { smartphoneFields } = request.body;

    const updatedSmartphones = await Promise.all(
      smartphoneFields.map(async (smartphoneField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = smartphoneField;

        const updatedSmartphone = await updateSmartphoneByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedSmartphone;
      })
    );

    const successfullyUpdatedSmartphones = updatedSmartphones.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyUpdatedSmartphones.length === smartphoneFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedSmartphones.length} smartphones`,
        resourceData: successfullyUpdatedSmartphones,
      });
      return;
    }

    if (successfullyUpdatedSmartphones.length === 0) {
      response.status(400).json({
        message: "Could not update any smartphones",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        smartphoneFields.length - successfullyUpdatedSmartphones.length
      } smartphones`,
      resourceData: successfullyUpdatedSmartphones,
    });
    return;
  }
);

// @desc   Get all smartphones
// @route  GET /api/v1/product-category/smartphone
// @access Private/Admin/Manager
const getQueriedSmartphonesController = expressAsyncController(
  async (
    request: GetQueriedSmartphonesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalSmartphonesService({
        filter: filter as FilterQuery<SmartphoneDocument> | undefined,
      });
    }

    const smartphones = await getQueriedSmartphonesService({
      filter: filter as FilterQuery<SmartphoneDocument> | undefined,
      projection: projection as QueryOptions<SmartphoneDocument>,
      options: options as QueryOptions<SmartphoneDocument>,
    });

    if (smartphones.length === 0) {
      response.status(200).json({
        message: "No smartphones that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved smartphones",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: smartphones,
    });
  }
);

// @desc   Get smartphone by id
// @route  GET /api/v1/product-category/smartphone/:smartphoneId
// @access Private/Admin/Manager
const getSmartphoneByIdController = expressAsyncController(
  async (
    request: GetSmartphoneByIdRequest,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>,
    next: NextFunction
  ) => {
    const smartphoneId = request.params.smartphoneId;

    const smartphone = await getSmartphoneByIdService(smartphoneId);
    if (!smartphone) {
      return next(new createHttpError.NotFound("Smartphone does not exist"));
    }

    response.status(200).json({
      message: "Successfully retrieved smartphone",
      resourceData: [smartphone],
    });
  }
);

// @desc   Update a smartphone by id
// @route  PUT /api/v1/product-category/smartphone/:smartphoneId
// @access Private/Admin/Manager
const updateSmartphoneByIdController = expressAsyncController(
  async (
    request: UpdateSmartphoneByIdRequest,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>,
    next: NextFunction
  ) => {
    const { smartphoneId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedSmartphone = await updateSmartphoneByIdService({
      _id: smartphoneId,
      fields,
      updateOperator,
    });

    if (!updatedSmartphone) {
      return next(
        new createHttpError.InternalServerError("Smartphone could not be updated")
      );
    }

    response.status(200).json({
      message: "Smartphone updated successfully",
      resourceData: [updatedSmartphone],
    });
  }
);

// @desc   Delete all smartphones
// @route  DELETE /api/v1/product-category/smartphone
// @access Private/Admin/Manager
const deleteAllSmartphonesController = expressAsyncController(
  async (
    _request: DeleteAllSmartphonesRequest,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllSmartphonesUploadedFileIdsService();

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
          "Some reviews could not be deleted. Please try again."
        )
      );
    }

    const deleteSmartphonesResult: DeleteResult = await deleteAllSmartphonesService();
    if (deleteSmartphonesResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError(
          "Some smartphones could not be deleted. Please try again."
        )
      );
    }

    response.status(200).json({ message: "All smartphones deleted", resourceData: [] });
  }
);

// @desc   Delete a smartphone by id
// @route  DELETE /api/v1/product-category/smartphone/:smartphoneId
// @access Private/Admin/Manager
const deleteASmartphoneController = expressAsyncController(
  async (
    request: DeleteASmartphoneRequest,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>,
    next: NextFunction
  ) => {
    const smartphoneId = request.params.smartphoneId;

    const smartphoneExists = await getSmartphoneByIdService(smartphoneId);
    if (!smartphoneExists) {
      return next(new createHttpError.NotFound("Smartphone does not exist"));
    }

    const uploadedFilesIds = [...smartphoneExists.uploadedFilesIds];

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
          "Some reviews could not be deleted. Please try again."
        )
      );
    }

    const deleteSmartphoneResult: DeleteResult = await deleteASmartphoneService(
      smartphoneId
    );
    if (deleteSmartphoneResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError(
          "Smartphone could not be deleted. Please try again."
        )
      );
    }

    response.status(200).json({ message: "Smartphone deleted", resourceData: [] });
  }
);

export {
  createNewSmartphoneBulkController,
  createNewSmartphoneController,
  deleteASmartphoneController,
  deleteAllSmartphonesController,
  getSmartphoneByIdController,
  getQueriedSmartphonesController,
  updateSmartphoneByIdController,
  updateSmartphonesBulkController,
};
