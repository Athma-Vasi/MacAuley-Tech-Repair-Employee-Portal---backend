import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewWebcamBulkRequest,
  CreateNewWebcamRequest,
  DeleteAWebcamRequest,
  DeleteAllWebcamsRequest,
  GetWebcamByIdRequest,
  GetQueriedWebcamsRequest,
  UpdateWebcamByIdRequest,
  UpdateWebcamsBulkRequest,
} from "./webcam.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { WebcamDocument } from "./webcam.model";

import {
  createNewWebcamService,
  deleteAWebcamService,
  deleteAllWebcamsService,
  getWebcamByIdService,
  getQueriedWebcamsService,
  getQueriedTotalWebcamsService,
  returnAllWebcamsUploadedFileIdsService,
  updateWebcamByIdService,
} from "./webcam.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new webcam
// @route  POST /api/v1/product-category/webcam
// @access Private/Admin/Manager
const createNewWebcamController = expressAsyncController(
  async (
    request: CreateNewWebcamRequest,
    response: Response<ResourceRequestServerResponse<WebcamDocument>>,
    next: NextFunction
  ) => {
    const { webcamSchema } = request.body;

    const webcamDocument: WebcamDocument = await createNewWebcamService(webcamSchema);
    if (!webcamDocument) {
      return next(new createHttpError.InternalServerError("Webcam could not be created"));
    }

    response.status(201).json({
      message: `Successfully created new ${webcamDocument.model} webcam`,
      resourceData: [webcamDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new webcams bulk
// @route  POST /api/v1/product-category/webcam/dev
// @access Private/Admin/Manager
const createNewWebcamBulkController = expressAsyncController(
  async (
    request: CreateNewWebcamBulkRequest,
    response: Response<ResourceRequestServerResponse<WebcamDocument>>,
    next: NextFunction
  ) => {
    const { webcamSchemas } = request.body;

    const newWebcams = await Promise.all(
      webcamSchemas.map(async (webcamSchema) => {
        const newWebcam = await createNewWebcamService(webcamSchema);
        return newWebcam;
      })
    );

    const successfullyCreatedWebcams = newWebcams.filter((webcam) => webcam);

    if (successfullyCreatedWebcams.length === webcamSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedWebcams.length} webcams`,
        resourceData: successfullyCreatedWebcams,
      });
      return;
    }

    if (successfullyCreatedWebcams.length === 0) {
      response.status(400).json({
        message: "Could not create any webcams",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        webcamSchemas.length - successfullyCreatedWebcams.length
      } webcams`,
      resourceData: successfullyCreatedWebcams,
    });
    return;
  }
);

// @desc   Update webcams bulk
// @route  PATCH /api/v1/product-category/webcam/dev
// @access Private/Admin/Manager
const updateWebcamsBulkController = expressAsyncController(
  async (
    request: UpdateWebcamsBulkRequest,
    response: Response<ResourceRequestServerResponse<WebcamDocument>>,
    next: NextFunction
  ) => {
    const { webcamFields } = request.body;

    const updatedWebcams = await Promise.all(
      webcamFields.map(async (webcamField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = webcamField;

        const updatedWebcam = await updateWebcamByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedWebcam;
      })
    );

    const successfullyUpdatedWebcams = updatedWebcams.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyUpdatedWebcams.length === webcamFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedWebcams.length} webcams`,
        resourceData: successfullyUpdatedWebcams,
      });
      return;
    }

    if (successfullyUpdatedWebcams.length === 0) {
      response.status(400).json({
        message: "Could not update any webcams",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        webcamFields.length - successfullyUpdatedWebcams.length
      } webcams`,
      resourceData: successfullyUpdatedWebcams,
    });
    return;
  }
);

// @desc   Get all webcams
// @route  GET /api/v1/product-category/webcam
// @access Private/Admin/Manager
const getQueriedWebcamsController = expressAsyncController(
  async (
    request: GetQueriedWebcamsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<WebcamDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalWebcamsService({
        filter: filter as FilterQuery<WebcamDocument> | undefined,
      });
    }

    const webcams = await getQueriedWebcamsService({
      filter: filter as FilterQuery<WebcamDocument> | undefined,
      projection: projection as QueryOptions<WebcamDocument>,
      options: options as QueryOptions<WebcamDocument>,
    });

    if (webcams.length === 0) {
      response.status(200).json({
        message: "No webcams that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved webcams",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: webcams,
    });
  }
);

// @desc   Get webcam by id
// @route  GET /api/v1/product-category/webcam/:webcamId
// @access Private/Admin/Manager
const getWebcamByIdController = expressAsyncController(
  async (
    request: GetWebcamByIdRequest,
    response: Response<ResourceRequestServerResponse<WebcamDocument>>,
    next: NextFunction
  ) => {
    const webcamId = request.params.webcamId;

    const webcam = await getWebcamByIdService(webcamId);
    if (!webcam) {
      return next(new createHttpError.NotFound("Webcam does not exist"));
    }

    response.status(200).json({
      message: "Successfully retrieved webcam",
      resourceData: [webcam],
    });
  }
);

// @desc   Update a webcam by id
// @route  PUT /api/v1/product-category/webcam/:webcamId
// @access Private/Admin/Manager
const updateWebcamByIdController = expressAsyncController(
  async (
    request: UpdateWebcamByIdRequest,
    response: Response<ResourceRequestServerResponse<WebcamDocument>>,
    next: NextFunction
  ) => {
    const { webcamId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedWebcam = await updateWebcamByIdService({
      _id: webcamId,
      fields,
      updateOperator,
    });

    if (!updatedWebcam) {
      return next(new createHttpError.InternalServerError("Webcam could not be updated"));
    }

    response.status(200).json({
      message: "Webcam updated successfully",
      resourceData: [updatedWebcam],
    });
  }
);

// @desc   Delete all webcams
// @route  DELETE /api/v1/product-category/webcam
// @access Private/Admin/Manager
const deleteAllWebcamsController = expressAsyncController(
  async (
    _request: DeleteAllWebcamsRequest,
    response: Response<ResourceRequestServerResponse<WebcamDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllWebcamsUploadedFileIdsService();

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

    const deleteWebcamsResult: DeleteResult = await deleteAllWebcamsService();
    if (deleteWebcamsResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError("Could not delete all webcams")
      );
    }

    response.status(200).json({ message: "All webcams deleted", resourceData: [] });
  }
);

// @desc   Delete a webcam by id
// @route  DELETE /api/v1/product-category/webcam/:webcamId
// @access Private/Admin/Manager
const deleteAWebcamController = expressAsyncController(
  async (
    request: DeleteAWebcamRequest,
    response: Response<ResourceRequestServerResponse<WebcamDocument>>,
    next: NextFunction
  ) => {
    const webcamId = request.params.webcamId;

    const webcamExists = await getWebcamByIdService(webcamId);
    if (!webcamExists) {
      response.status(404).json({ message: "Webcam does not exist", resourceData: [] });
      return;
    }

    const uploadedFilesIds = [...webcamExists.uploadedFilesIds];

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

    const deleteWebcamResult: DeleteResult = await deleteAWebcamService(webcamId);
    if (deleteWebcamResult.deletedCount === 0) {
      return next(new createHttpError.InternalServerError("Could not delete webcam"));
    }

    response.status(200).json({ message: "Webcam deleted", resourceData: [] });
  }
);

export {
  createNewWebcamBulkController,
  createNewWebcamController,
  deleteAWebcamController,
  deleteAllWebcamsController,
  getWebcamByIdController,
  getQueriedWebcamsController,
  updateWebcamByIdController,
  updateWebcamsBulkController,
};

/**
 * // find all fileUploads associated with the webcams
    const fileUploadsArrArr = await Promise.all(
      webcams.map(async (webcam) => {
        const fileUploadPromises = webcam.uploadedFilesIds.map(async (uploadedFileId) => {
          const fileUpload = await getFileUploadByIdService(uploadedFileId);

          return fileUpload;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const fileUploads = await Promise.all(fileUploadPromises);

        // Filter out any undefined values (in case fileUpload was not found)
        return fileUploads.filter(removeUndefinedAndNullValues);
      })
    );

    // find all reviews associated with the webcams
    const reviewsArrArr = await Promise.all(
      webcams.map(async (webcam) => {
        const reviewPromises = webcam.productReviewsIds.map(async (reviewId) => {
          const review = await getProductReviewByIdService(reviewId);

          return review;
        });

        // Wait for all the promises to resolve before continuing to the next iteration
        const reviews = await Promise.all(reviewPromises);

        // Filter out any undefined values (in case review was not found)
        return reviews.filter(removeUndefinedAndNullValues);
      })
    );

    // create webcamServerResponse array
    const webcamServerResponseArray = webcams.map((webcam, index) => {
      const fileUploads = fileUploadsArrArr[index];
      const productReviews = reviewsArrArr[index];
      return {
        ...webcam,
        fileUploads,
        productReviews,
      };
    });
 */

/**
	 * // get all fileUploads associated with the webcam
    const fileUploads = await Promise.all(
      webcam.uploadedFilesIds.map(async (uploadedFileId) => {
        const fileUpload = await getFileUploadByIdService(uploadedFileId);

        return fileUpload;
      })
    );

    // get all reviews associated with the webcam
    const productReviews = await Promise.all(
      webcam.productReviewsIds.map(async (reviewId) => {
        const review = await getProductReviewByIdService(reviewId);

        return review;
      })
    );

    // create webcamServerResponse
    const webcamServerResponse = {
      ...webcam,
      fileUploads: fileUploads.filter(removeUndefinedAndNullValues),
      productReviews: productReviews.filter(removeUndefinedAndNullValues),
    };
	 */
