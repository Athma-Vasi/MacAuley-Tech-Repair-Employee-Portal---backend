import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewDisplayBulkRequest,
  CreateNewDisplayRequest,
  DeleteADisplayRequest,
  DeleteAllDisplaysRequest,
  GetDisplayByIdRequest,
  GetQueriedDisplaysRequest,
  UpdateDisplayByIdRequest,
  UpdateDisplaysBulkRequest,
} from "./display.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { DisplayDocument } from "./display.model";

import {
  createNewDisplayService,
  deleteADisplayService,
  deleteAllDisplaysService,
  getDisplayByIdService,
  getQueriedDisplaysService,
  getQueriedTotalDisplaysService,
  returnAllDisplaysUploadedFileIdsService,
  updateDisplayByIdService,
} from "./display.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new display
// @route  POST /api/v1/product-category/display
// @access Private/Admin/Manager
const createNewDisplayController = expressAsyncController(
  async (
    request: CreateNewDisplayRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>,
    next: NextFunction
  ) => {
    const { displaySchema } = request.body;

    const displayDocument: DisplayDocument = await createNewDisplayService(displaySchema);
    if (!displayDocument) {
      return next(
        new createHttpError.InternalServerError("Display document could not be created")
      );
    }

    response.status(201).json({
      message: `Successfully created new ${displayDocument.model} display`,
      resourceData: [displayDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new displays bulk
// @route  POST /api/v1/product-category/display/dev
// @access Private/Admin/Manager
const createNewDisplayBulkController = expressAsyncController(
  async (
    request: CreateNewDisplayBulkRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>,
    next: NextFunction
  ) => {
    const { displaySchemas } = request.body;

    const newDisplays = await Promise.all(
      displaySchemas.map(async (displaySchema) => {
        const newDisplay = await createNewDisplayService(displaySchema);
        return newDisplay;
      })
    );

    const successfullyCreatedDisplays = newDisplays.filter((display) => display);

    if (successfullyCreatedDisplays.length === displaySchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedDisplays.length} displays`,
        resourceData: successfullyCreatedDisplays,
      });
      return;
    }

    if (successfullyCreatedDisplays.length === 0) {
      response.status(400).json({
        message: "Could not create any displays",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        displaySchemas.length - successfullyCreatedDisplays.length
      } displays`,
      resourceData: successfullyCreatedDisplays,
    });
    return;
  }
);

// @desc   Update displays bulk
// @route  PATCH /api/v1/product-category/display/dev
// @access Private/Admin/Manager
const updateDisplaysBulkController = expressAsyncController(
  async (
    request: UpdateDisplaysBulkRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>,
    next: NextFunction
  ) => {
    const { displayFields } = request.body;

    const updatedDisplays = await Promise.all(
      displayFields.map(async (displayField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = displayField;

        const updatedDisplay = await updateDisplayByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedDisplay;
      })
    );

    const successfullyUpdatedDisplays = updatedDisplays.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyUpdatedDisplays.length === displayFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedDisplays.length} displays`,
        resourceData: successfullyUpdatedDisplays,
      });
      return;
    }

    if (successfullyUpdatedDisplays.length === 0) {
      response.status(400).json({
        message: "Could not update any displays",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        displayFields.length - successfullyUpdatedDisplays.length
      } displays`,
      resourceData: successfullyUpdatedDisplays,
    });
    return;
  }
);

// @desc   Get all displays
// @route  GET /api/v1/product-category/display
// @access Private/Admin/Manager
const getQueriedDisplaysController = expressAsyncController(
  async (
    request: GetQueriedDisplaysRequest,
    response: Response<GetQueriedResourceRequestServerResponse<DisplayDocument>>,
    next: NextFunction
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalDisplaysService({
        filter: filter as FilterQuery<DisplayDocument> | undefined,
      });
    }

    const displays = await getQueriedDisplaysService({
      filter: filter as FilterQuery<DisplayDocument> | undefined,
      projection: projection as QueryOptions<DisplayDocument>,
      options: options as QueryOptions<DisplayDocument>,
    });

    if (displays.length === 0) {
      response.status(200).json({
        message: "No displays that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved displays",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: displays,
    });
  }
);

// @desc   Get display by id
// @route  GET /api/v1/product-category/display/:displayId
// @access Private/Admin/Manager
const getDisplayByIdController = expressAsyncController(
  async (
    request: GetDisplayByIdRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>,
    next: NextFunction
  ) => {
    const displayId = request.params.displayId;

    const display = await getDisplayByIdService(displayId);
    if (!display) {
      return next(new createHttpError.NotFound("Display does not exist"));
    }

    response.status(200).json({
      message: "Successfully retrieved display",
      resourceData: [display],
    });
  }
);

// @desc   Update a display by id
// @route  PUT /api/v1/product-category/display/:displayId
// @access Private/Admin/Manager
const updateDisplayByIdController = expressAsyncController(
  async (
    request: UpdateDisplayByIdRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>,
    next: NextFunction
  ) => {
    const { displayId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedDisplay = await updateDisplayByIdService({
      _id: displayId,
      fields,
      updateOperator,
    });

    if (!updatedDisplay) {
      return next(
        new createHttpError.InternalServerError("Display could not be updated")
      );
    }

    response.status(200).json({
      message: "Display updated successfully",
      resourceData: [updatedDisplay],
    });
  }
);

// @desc   Delete all displays
// @route  DELETE /api/v1/product-category/display
// @access Private/Admin/Manager
const deleteAllDisplaysController = expressAsyncController(
  async (
    _request: DeleteAllDisplaysRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllDisplaysUploadedFileIdsService();

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
          "Some File uploads could not be deleted. Please try again."
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

    const deleteDisplaysResult: DeleteResult = await deleteAllDisplaysService();

    if (deleteDisplaysResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError(
          "Displays could not be deleted. Please try again."
        )
      );
    }

    response.status(200).json({ message: "All displays deleted", resourceData: [] });
  }
);

// @desc   Delete a display by id
// @route  DELETE /api/v1/product-category/display/:displayId
// @access Private/Admin/Manager
const deleteADisplayController = expressAsyncController(
  async (
    request: DeleteADisplayRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>,
    next: NextFunction
  ) => {
    const displayId = request.params.displayId;

    const displayExists = await getDisplayByIdService(displayId);
    if (!displayExists) {
      return next(new createHttpError.NotFound("Display does not exist"));
    }

    const uploadedFilesIds = [...displayExists.uploadedFilesIds];

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
          "Some File uploads could not be deleted. Please try again."
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
        new createHttpError.InternalServerError("Some reviews could not be deleted")
      );
    }

    const deleteDisplayResult: DeleteResult = await deleteADisplayService(displayId);

    if (deleteDisplayResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError(
          "Display could not be deleted. Please try again."
        )
      );
    }

    response.status(200).json({ message: "Display deleted", resourceData: [] });
  }
);

export {
  createNewDisplayBulkController,
  createNewDisplayController,
  deleteADisplayController,
  deleteAllDisplaysController,
  getDisplayByIdController,
  getQueriedDisplaysController,
  updateDisplayByIdController,
  updateDisplaysBulkController,
};
