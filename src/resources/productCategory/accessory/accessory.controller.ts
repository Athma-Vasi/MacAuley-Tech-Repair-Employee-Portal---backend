import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewAccessoryBulkRequest,
  CreateNewAccessoryRequest,
  DeleteAnAccessoryRequest,
  DeleteAllAccessoriesRequest,
  GetAccessoryByIdRequest,
  GetQueriedAccessoriesRequest,
  UpdateAccessoryByIdRequest,
  UpdateAccessoriesBulkRequest,
} from "./accessory.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { AccessoryDocument } from "./accessory.model";

import {
  createNewAccessoryService,
  deleteAnAccessoryService,
  deleteAllAccessoriesService,
  getAccessoryByIdService,
  getQueriedAccessoriesService,
  getQueriedTotalAccessoriesService,
  returnAllAccessoriesUploadedFileIdsService,
  updateAccessoryByIdService,
} from "./accessory.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new accessory
// @route  POST /api/v1/product-category/accessory
// @access Private/Admin/Manager
const createNewAccessoryController = expressAsyncController(
  async (
    request: CreateNewAccessoryRequest,
    response: Response<ResourceRequestServerResponse<AccessoryDocument>>,
    next: NextFunction
  ) => {
    const { accessorySchema } = request.body;

    const accessoryDocument: AccessoryDocument = await createNewAccessoryService(
      accessorySchema
    );
    if (!accessoryDocument) {
      return next(
        new createHttpError.InternalServerError("Accessory could not be created")
      );
    }

    response.status(201).json({
      message: `Successfully created new ${accessoryDocument.model} accessory`,
      resourceData: [accessoryDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new accessories bulk
// @route  POST /api/v1/product-category/accessory/dev
// @access Private/Admin/Manager
const createNewAccessoryBulkController = expressAsyncController(
  async (
    request: CreateNewAccessoryBulkRequest,
    response: Response<ResourceRequestServerResponse<AccessoryDocument>>
  ) => {
    const { accessorySchemas } = request.body;

    const newAccessories = await Promise.all(
      accessorySchemas.map(async (accessorySchema) => {
        const newAccessory = await createNewAccessoryService(accessorySchema);
        return newAccessory;
      })
    );

    const successfullyCreatedAccessories = newAccessories.filter(
      (accessory) => accessory
    );

    if (successfullyCreatedAccessories.length === accessorySchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedAccessories.length} accessories`,
        resourceData: successfullyCreatedAccessories,
      });
      return;
    }

    if (successfullyCreatedAccessories.length === 0) {
      response.status(400).json({
        message: "Could not create any accessories",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        accessorySchemas.length - successfullyCreatedAccessories.length
      } accessories`,
      resourceData: successfullyCreatedAccessories,
    });
    return;
  }
);

// @desc   Update accessories bulk
// @route  PATCH /api/v1/product-category/accessory/dev
// @access Private/Admin/Manager
const updateAccessoriesBulkController = expressAsyncController(
  async (
    request: UpdateAccessoriesBulkRequest,
    response: Response<ResourceRequestServerResponse<AccessoryDocument>>,
    next: NextFunction
  ) => {
    const { accessoryFields } = request.body;

    const updatedAccessories = await Promise.all(
      accessoryFields.map(async (accessoryField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = accessoryField;

        const updatedAccessory = await updateAccessoryByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedAccessory;
      })
    );

    const successfullyUpdatedAccessories = updatedAccessories.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyUpdatedAccessories.length === accessoryFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedAccessories.length} accessories`,
        resourceData: successfullyUpdatedAccessories,
      });

      return;
    }

    if (successfullyUpdatedAccessories.length === 0) {
      return next(
        new createHttpError.InternalServerError("Could not update any accessories")
      );
    }

    response.status(201).json({
      message: `Successfully updated ${
        accessoryFields.length - successfullyUpdatedAccessories.length
      } accessories`,
      resourceData: successfullyUpdatedAccessories,
    });
    return;
  }
);

// @desc   Get all accessories
// @route  GET /api/v1/product-category/accessory
// @access Private/Admin/Manager
const getQueriedAccessoriesController = expressAsyncController(
  async (
    request: GetQueriedAccessoriesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AccessoryDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalAccessoriesService({
        filter: filter as FilterQuery<AccessoryDocument> | undefined,
      });
    }

    const accessories = await getQueriedAccessoriesService({
      filter: filter as FilterQuery<AccessoryDocument> | undefined,
      projection: projection as QueryOptions<AccessoryDocument>,
      options: options as QueryOptions<AccessoryDocument>,
    });

    if (accessories.length === 0) {
      response.status(200).json({
        message: "No accessories that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved accessories",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: accessories,
    });
  }
);

// @desc   Get accessory by id
// @route  GET /api/v1/product-category/accessory/:accessoryId
// @access Private/Admin/Manager
const getAccessoryByIdController = expressAsyncController(
  async (
    request: GetAccessoryByIdRequest,
    response: Response<ResourceRequestServerResponse<AccessoryDocument>>,
    next: NextFunction
  ) => {
    const { accessoryId } = request.params;

    const accessory = await getAccessoryByIdService(accessoryId);
    if (!accessory) {
      return next(new createHttpError.NotFound("Accessory does not exist"));
    }

    response.status(200).json({
      message: "Successfully retrieved accessory",
      resourceData: [accessory],
    });
  }
);

// @desc   Update a accessory by id
// @route  PUT /api/v1/product-category/accessory/:accessoryId
// @access Private/Admin/Manager
const updateAccessoryByIdController = expressAsyncController(
  async (
    request: UpdateAccessoryByIdRequest,
    response: Response<ResourceRequestServerResponse<AccessoryDocument>>,
    next: NextFunction
  ) => {
    const { accessoryId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedAccessory = await updateAccessoryByIdService({
      _id: accessoryId,
      fields,
      updateOperator,
    });

    if (!updatedAccessory) {
      return next(
        new createHttpError.InternalServerError("Accessory could not be updated")
      );
    }

    response.status(200).json({
      message: "Accessory updated successfully",
      resourceData: [updatedAccessory],
    });
  }
);

// @desc   Delete all accessories
// @route  DELETE /api/v1/product-category/accessory
// @access Private/Admin/Manager
const deleteAllAccessoriesController = expressAsyncController(
  async (
    _request: DeleteAllAccessoriesRequest,
    response: Response<ResourceRequestServerResponse<AccessoryDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllAccessoriesUploadedFileIdsService();

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

    const deleteAccessoriesResult: DeleteResult = await deleteAllAccessoriesService();

    if (deleteAccessoriesResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError(
          "Accessories could not be deleted. Please try again."
        )
      );
    }

    response.status(200).json({ message: "All accessories deleted", resourceData: [] });
  }
);

// @desc   Delete a accessory by id
// @route  DELETE /api/v1/product-category/accessory/:accessoryId
// @access Private/Admin/Manager
const deleteAAccessoryController = expressAsyncController(
  async (
    request: DeleteAnAccessoryRequest,
    response: Response<ResourceRequestServerResponse<AccessoryDocument>>,
    next: NextFunction
  ) => {
    const accessoryId = request.params.accessoryId;

    const accessoryExists = await getAccessoryByIdService(accessoryId);
    if (!accessoryExists) {
      return next(new createHttpError.NotFound("Accessory does not exist"));
    }

    const uploadedFilesIds = [...accessoryExists.uploadedFilesIds];

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

    const deleteAccessoryResult: DeleteResult = await deleteAnAccessoryService(
      accessoryId
    );

    if (deleteAccessoryResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError(
          "Accessory could not be deleted. Please try again."
        )
      );
    }

    response.status(200).json({ message: "Accessory deleted", resourceData: [] });
  }
);

export {
  createNewAccessoryBulkController,
  createNewAccessoryController,
  deleteAAccessoryController,
  deleteAllAccessoriesController,
  getAccessoryByIdController,
  getQueriedAccessoriesController,
  updateAccessoryByIdController,
  updateAccessoriesBulkController,
};
