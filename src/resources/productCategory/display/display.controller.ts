import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
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

// @desc   Create new display
// @route  POST /api/v1/product-category/display
// @access Private/Admin/Manager
const createNewDisplayController = expressAsyncController(
  async (
    request: CreateNewDisplayRequest,
    response: Response<ResourceRequestServerResponse<DisplayDocument>>
  ) => {
    const { displaySchema } = request.body;

    const displayDocument: DisplayDocument = await createNewDisplayService(displaySchema);

    if (!displayDocument) {
      response.status(400).json({
        message: "Could not create new display",
        resourceData: [],
      });
      return;
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
    response: Response<ResourceRequestServerResponse<DisplayDocument>>
  ) => {
    const { displaySchemas } = request.body;

    const newDisplays = await Promise.all(
      displaySchemas.map(async (displaySchema) => {
        const newDisplay = await createNewDisplayService(displaySchema);
        return newDisplay;
      })
    );

    // filter out any displays that were not created
    const successfullyCreatedDisplays = newDisplays.filter((display) => display);

    // check if any displays were created
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
    response: Response<ResourceRequestServerResponse<DisplayDocument>>
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

    // filter out any displays that were not updated
    const successfullyUpdatedDisplays = updatedDisplays.filter(
      removeUndefinedAndNullValues
    );

    // check if any displays were updated
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
    response: Response<GetQueriedResourceRequestServerResponse<DisplayDocument>>
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

    // get all displays
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
    response: Response<ResourceRequestServerResponse<DisplayDocument>>
  ) => {
    const displayId = request.params.displayId;

    // get display by id
    const display = await getDisplayByIdService(displayId);
    if (!display) {
      response.status(404).json({ message: "Display not found", resourceData: [] });
      return;
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
    response: Response<ResourceRequestServerResponse<DisplayDocument>>
  ) => {
    const { displayId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    // update display
    const updatedDisplay = await updateDisplayByIdService({
      _id: displayId,
      fields,
      updateOperator,
    });

    if (!updatedDisplay) {
      response.status(400).json({
        message: "Display could not be updated",
        resourceData: [],
      });
      return;
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
    response: Response<ResourceRequestServerResponse<DisplayDocument>>
  ) => {
    // grab all displays file upload ids
    const uploadedFilesIds = await returnAllDisplaysUploadedFileIdsService();

    // delete all file uploads associated with all displays
    const deletedFileUploads = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId)
      )
    );

    if (
      deletedFileUploads.some((deletedFileUpload) => deletedFileUpload.deletedCount === 0)
    ) {
      response.status(400).json({
        message: "Some File uploads could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
    }

    // delete all reviews associated with all displays
    const deletedReviews = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteAProductReviewService(fileUploadId)
      )
    );

    if (deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)) {
      response.status(400).json({
        message: "Some reviews could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
    }

    // delete all displays
    const deleteDisplaysResult: DeleteResult = await deleteAllDisplaysService();

    if (deleteDisplaysResult.deletedCount === 0) {
      response.status(400).json({
        message: "All displays could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
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
    response: Response<ResourceRequestServerResponse<DisplayDocument>>
  ) => {
    const displayId = request.params.displayId;

    // check if display exists
    const displayExists = await getDisplayByIdService(displayId);
    if (!displayExists) {
      response.status(404).json({ message: "Display does not exist", resourceData: [] });
      return;
    }

    // find all file uploads associated with this display
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...displayExists.uploadedFilesIds];

    // delete all file uploads associated with all displays
    const deletedFileUploads = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId)
      )
    );

    if (
      deletedFileUploads.some((deletedFileUpload) => deletedFileUpload.deletedCount === 0)
    ) {
      response.status(400).json({
        message: "Some File uploads could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
    }

    // delete all reviews associated with all displays
    const deletedReviews = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteAProductReviewService(fileUploadId)
      )
    );

    if (deletedReviews.some((deletedReview) => deletedReview.deletedCount === 0)) {
      response.status(400).json({
        message: "Some reviews could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
    }

    // delete display by id
    const deleteDisplayResult: DeleteResult = await deleteADisplayService(displayId);

    if (deleteDisplayResult.deletedCount === 0) {
      response.status(400).json({
        message: "Display could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
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
