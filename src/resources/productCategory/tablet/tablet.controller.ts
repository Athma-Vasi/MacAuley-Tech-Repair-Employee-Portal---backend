import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewTabletBulkRequest,
  CreateNewTabletRequest,
  DeleteATabletRequest,
  DeleteAllTabletsRequest,
  GetTabletByIdRequest,
  GetQueriedTabletsRequest,
  UpdateTabletByIdRequest,
  UpdateTabletsBulkRequest,
} from "./tablet.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { TabletDocument } from "./tablet.model";

import {
  createNewTabletService,
  deleteATabletService,
  deleteAllTabletsService,
  getTabletByIdService,
  getQueriedTabletsService,
  getQueriedTotalTabletsService,
  returnAllTabletsUploadedFileIdsService,
  updateTabletByIdService,
} from "./tablet.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new tablet
// @route  POST /api/v1/product-category/tablet
// @access Private/Admin/Manager
const createNewTabletController = expressAsyncController(
  async (
    request: CreateNewTabletRequest,
    response: Response<ResourceRequestServerResponse<TabletDocument>>,
    next: NextFunction
  ) => {
    const { tabletSchema } = request.body;

    const tabletDocument: TabletDocument = await createNewTabletService(tabletSchema);
    if (!tabletDocument) {
      return next(new createHttpError.InternalServerError("Could not create new tablet"));
    }

    response.status(201).json({
      message: `Successfully created new ${tabletDocument.model} tablet`,
      resourceData: [tabletDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new tablets bulk
// @route  POST /api/v1/product-category/tablet/dev
// @access Private/Admin/Manager
const createNewTabletBulkController = expressAsyncController(
  async (
    request: CreateNewTabletBulkRequest,
    response: Response<ResourceRequestServerResponse<TabletDocument>>,
    next: NextFunction
  ) => {
    const { tabletSchemas } = request.body;

    const newTablets = await Promise.all(
      tabletSchemas.map(async (tabletSchema) => {
        const newTablet = await createNewTabletService(tabletSchema);
        return newTablet;
      })
    );

    const successfullyCreatedTablets = newTablets.filter((tablet) => tablet);

    if (successfullyCreatedTablets.length === tabletSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedTablets.length} tablets`,
        resourceData: successfullyCreatedTablets,
      });
      return;
    }

    if (successfullyCreatedTablets.length === 0) {
      response.status(400).json({
        message: "Could not create any tablets",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        tabletSchemas.length - successfullyCreatedTablets.length
      } tablets`,
      resourceData: successfullyCreatedTablets,
    });
    return;
  }
);

// @desc   Update tablets bulk
// @route  PATCH /api/v1/product-category/tablet/dev
// @access Private/Admin/Manager
const updateTabletsBulkController = expressAsyncController(
  async (
    request: UpdateTabletsBulkRequest,
    response: Response<ResourceRequestServerResponse<TabletDocument>>,
    next: NextFunction
  ) => {
    const { tabletFields } = request.body;

    const updatedTablets = await Promise.all(
      tabletFields.map(async (tabletField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = tabletField;

        const updatedTablet = await updateTabletByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedTablet;
      })
    );

    const successfullyUpdatedTablets = updatedTablets.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyUpdatedTablets.length === tabletFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedTablets.length} tablets`,
        resourceData: successfullyUpdatedTablets,
      });
      return;
    }

    if (successfullyUpdatedTablets.length === 0) {
      response.status(400).json({
        message: "Could not update any tablets",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        tabletFields.length - successfullyUpdatedTablets.length
      } tablets`,
      resourceData: successfullyUpdatedTablets,
    });
    return;
  }
);

// @desc   Get all tablets
// @route  GET /api/v1/product-category/tablet
// @access Private/Admin/Manager
const getQueriedTabletsController = expressAsyncController(
  async (
    request: GetQueriedTabletsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<TabletDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalTabletsService({
        filter: filter as FilterQuery<TabletDocument> | undefined,
      });
    }

    const tablets = await getQueriedTabletsService({
      filter: filter as FilterQuery<TabletDocument> | undefined,
      projection: projection as QueryOptions<TabletDocument>,
      options: options as QueryOptions<TabletDocument>,
    });

    if (tablets.length === 0) {
      response.status(200).json({
        message: "No tablets that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved tablets",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: tablets,
    });
  }
);

// @desc   Get tablet by id
// @route  GET /api/v1/product-category/tablet/:tabletId
// @access Private/Admin/Manager
const getTabletByIdController = expressAsyncController(
  async (
    request: GetTabletByIdRequest,
    response: Response<ResourceRequestServerResponse<TabletDocument>>,
    next: NextFunction
  ) => {
    const tabletId = request.params.tabletId;

    const tablet = await getTabletByIdService(tabletId);
    if (!tablet) {
      return next(new createHttpError.NotFound("Tablet does not exist"));
    }

    response.status(200).json({
      message: "Successfully retrieved tablet",
      resourceData: [tablet],
    });
  }
);

// @desc   Update a tablet by id
// @route  PUT /api/v1/product-category/tablet/:tabletId
// @access Private/Admin/Manager
const updateTabletByIdController = expressAsyncController(
  async (
    request: UpdateTabletByIdRequest,
    response: Response<ResourceRequestServerResponse<TabletDocument>>,
    next: NextFunction
  ) => {
    const { tabletId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedTablet = await updateTabletByIdService({
      _id: tabletId,
      fields,
      updateOperator,
    });

    if (!updatedTablet) {
      return next(new createHttpError.InternalServerError("Could not update tablet"));
    }

    response.status(200).json({
      message: "Tablet updated successfully",
      resourceData: [updatedTablet],
    });
  }
);

// @desc   Delete all tablets
// @route  DELETE /api/v1/product-category/tablet
// @access Private/Admin/Manager
const deleteAllTabletsController = expressAsyncController(
  async (
    _request: DeleteAllTabletsRequest,
    response: Response<ResourceRequestServerResponse<TabletDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllTabletsUploadedFileIdsService();

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

    const deleteTabletsResult: DeleteResult = await deleteAllTabletsService();
    if (deleteTabletsResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError("Could not delete all tablets")
      );
    }

    response.status(200).json({ message: "All tablets deleted", resourceData: [] });
  }
);

// @desc   Delete a tablet by id
// @route  DELETE /api/v1/product-category/tablet/:tabletId
// @access Private/Admin/Manager
const deleteATabletController = expressAsyncController(
  async (
    request: DeleteATabletRequest,
    response: Response<ResourceRequestServerResponse<TabletDocument>>,
    next: NextFunction
  ) => {
    const tabletId = request.params.tabletId;

    const tabletExists = await getTabletByIdService(tabletId);
    if (!tabletExists) {
      return next(new createHttpError.NotFound("Tablet does not exist"));
    }

    const uploadedFilesIds = [...tabletExists.uploadedFilesIds];

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

    const deleteTabletResult: DeleteResult = await deleteATabletService(tabletId);
    if (deleteTabletResult.deletedCount === 0) {
      return next(new createHttpError.InternalServerError("Could not delete tablet"));
    }

    response.status(200).json({ message: "Tablet deleted", resourceData: [] });
  }
);

export {
  createNewTabletBulkController,
  createNewTabletController,
  deleteATabletController,
  deleteAllTabletsController,
  getTabletByIdController,
  getQueriedTabletsController,
  updateTabletByIdController,
  updateTabletsBulkController,
};
