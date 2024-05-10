import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewStorageBulkRequest,
  CreateNewStorageRequest,
  DeleteAStorageRequest,
  DeleteAllStoragesRequest,
  GetStorageByIdRequest,
  GetQueriedStoragesRequest,
  UpdateStorageByIdRequest,
  UpdateStoragesBulkRequest,
} from "./storage.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { StorageDocument } from "./storage.model";

import {
  createNewStorageService,
  deleteAStorageService,
  deleteAllStoragesService,
  getStorageByIdService,
  getQueriedStoragesService,
  getQueriedTotalStoragesService,
  returnAllStoragesUploadedFileIdsService,
  updateStorageByIdService,
} from "./storage.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new storage
// @route  POST /api/v1/product-category/storage
// @access Private/Admin/Manager
const createNewStorageController = expressAsyncController(
  async (
    request: CreateNewStorageRequest,
    response: Response<ResourceRequestServerResponse<StorageDocument>>,
    next: NextFunction
  ) => {
    const { storageSchema } = request.body;

    const storageDocument: StorageDocument = await createNewStorageService(storageSchema);
    if (!storageDocument) {
      return next(
        new createHttpError.InternalServerError("Could not create new storage")
      );
    }

    response.status(201).json({
      message: `Successfully created new ${storageDocument.model} storage`,
      resourceData: [storageDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new storages bulk
// @route  POST /api/v1/product-category/storage/dev
// @access Private/Admin/Manager
const createNewStorageBulkController = expressAsyncController(
  async (
    request: CreateNewStorageBulkRequest,
    response: Response<ResourceRequestServerResponse<StorageDocument>>,
    next: NextFunction
  ) => {
    const { storageSchemas } = request.body;

    const newStorages = await Promise.all(
      storageSchemas.map(async (storageSchema) => {
        const newStorage = await createNewStorageService(storageSchema);
        return newStorage;
      })
    );

    const successfullyCreatedStorages = newStorages.filter((storage) => storage);

    if (successfullyCreatedStorages.length === storageSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedStorages.length} storages`,
        resourceData: successfullyCreatedStorages,
      });
      return;
    }

    if (successfullyCreatedStorages.length === 0) {
      response.status(400).json({
        message: "Could not create any storages",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        storageSchemas.length - successfullyCreatedStorages.length
      } storages`,
      resourceData: successfullyCreatedStorages,
    });
    return;
  }
);

// @desc   Update storages bulk
// @route  PATCH /api/v1/product-category/storage/dev
// @access Private/Admin/Manager
const updateStoragesBulkController = expressAsyncController(
  async (
    request: UpdateStoragesBulkRequest,
    response: Response<ResourceRequestServerResponse<StorageDocument>>,
    next: NextFunction
  ) => {
    const { storageFields } = request.body;

    const updatedStorages = await Promise.all(
      storageFields.map(async (storageField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = storageField;

        const updatedStorage = await updateStorageByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedStorage;
      })
    );

    const successfullyUpdatedStorages = updatedStorages.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyUpdatedStorages.length === storageFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedStorages.length} storages`,
        resourceData: successfullyUpdatedStorages,
      });
      return;
    }

    if (successfullyUpdatedStorages.length === 0) {
      response.status(400).json({
        message: "Could not update any storages",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        storageFields.length - successfullyUpdatedStorages.length
      } storages`,
      resourceData: successfullyUpdatedStorages,
    });
    return;
  }
);

// @desc   Get all storages
// @route  GET /api/v1/product-category/storage
// @access Private/Admin/Manager
const getQueriedStoragesController = expressAsyncController(
  async (
    request: GetQueriedStoragesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<StorageDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalStoragesService({
        filter: filter as FilterQuery<StorageDocument> | undefined,
      });
    }

    const storages = await getQueriedStoragesService({
      filter: filter as FilterQuery<StorageDocument> | undefined,
      projection: projection as QueryOptions<StorageDocument>,
      options: options as QueryOptions<StorageDocument>,
    });

    if (storages.length === 0) {
      response.status(200).json({
        message: "No storages that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved storages",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: storages,
    });
  }
);

// @desc   Get storage by id
// @route  GET /api/v1/product-category/storage/:storageId
// @access Private/Admin/Manager
const getStorageByIdController = expressAsyncController(
  async (
    request: GetStorageByIdRequest,
    response: Response<ResourceRequestServerResponse<StorageDocument>>,
    next: NextFunction
  ) => {
    const storageId = request.params.storageId;

    const storage = await getStorageByIdService(storageId);
    if (!storage) {
      return next(new createHttpError.NotFound("Storage does not exist"));
    }

    response.status(200).json({
      message: "Successfully retrieved storage",
      resourceData: [storage],
    });
  }
);

// @desc   Update a storage by id
// @route  PUT /api/v1/product-category/storage/:storageId
// @access Private/Admin/Manager
const updateStorageByIdController = expressAsyncController(
  async (
    request: UpdateStorageByIdRequest,
    response: Response<ResourceRequestServerResponse<StorageDocument>>,
    next: NextFunction
  ) => {
    const { storageId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedStorage = await updateStorageByIdService({
      _id: storageId,
      fields,
      updateOperator,
    });

    if (!updatedStorage) {
      return next(new createHttpError.InternalServerError("Could not update storage"));
    }

    response.status(200).json({
      message: "Storage updated successfully",
      resourceData: [updatedStorage],
    });
  }
);

// @desc   Delete all storages
// @route  DELETE /api/v1/product-category/storage
// @access Private/Admin/Manager
const deleteAllStoragesController = expressAsyncController(
  async (
    _request: DeleteAllStoragesRequest,
    response: Response<ResourceRequestServerResponse<StorageDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllStoragesUploadedFileIdsService();

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
          "Could not delete all file uploads associated with storages"
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
          "Could not delete all reviews associated with storages"
        )
      );
    }

    const deleteStoragesResult: DeleteResult = await deleteAllStoragesService();
    if (deleteStoragesResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError("Could not delete all storages")
      );
    }

    response.status(200).json({ message: "All storages deleted", resourceData: [] });
  }
);

// @desc   Delete a storage by id
// @route  DELETE /api/v1/product-category/storage/:storageId
// @access Private/Admin/Manager
const deleteAStorageController = expressAsyncController(
  async (
    request: DeleteAStorageRequest,
    response: Response<ResourceRequestServerResponse<StorageDocument>>,
    next: NextFunction
  ) => {
    const storageId = request.params.storageId;

    const storageExists = await getStorageByIdService(storageId);
    if (!storageExists) {
      return next(new createHttpError.NotFound("Storage does not exist"));
    }

    const uploadedFilesIds = [...storageExists.uploadedFilesIds];

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
          "Could not delete all file uploads associated with storages"
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
          "Could not delete all reviews associated with storages"
        )
      );
    }

    const deleteStorageResult: DeleteResult = await deleteAStorageService(storageId);
    if (deleteStorageResult.deletedCount === 0) {
      return next(new createHttpError.InternalServerError("Could not delete storage"));
    }

    response.status(200).json({ message: "Storage deleted", resourceData: [] });
  }
);

export {
  createNewStorageBulkController,
  createNewStorageController,
  deleteAStorageController,
  deleteAllStoragesController,
  getStorageByIdController,
  getQueriedStoragesController,
  updateStorageByIdController,
  updateStoragesBulkController,
};
