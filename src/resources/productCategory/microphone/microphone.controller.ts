import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewMicrophoneBulkRequest,
  CreateNewMicrophoneRequest,
  DeleteAMicrophoneRequest,
  DeleteAllMicrophonesRequest,
  GetMicrophoneByIdRequest,
  GetQueriedMicrophonesRequest,
  UpdateMicrophoneByIdRequest,
  UpdateMicrophonesBulkRequest,
} from "./microphone.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { MicrophoneDocument } from "./microphone.model";

import {
  createNewMicrophoneService,
  deleteAMicrophoneService,
  deleteAllMicrophonesService,
  getMicrophoneByIdService,
  getQueriedMicrophonesService,
  getQueriedTotalMicrophonesService,
  returnAllMicrophonesUploadedFileIdsService,
  updateMicrophoneByIdService,
} from "./microphone.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new microphone
// @route  POST /api/v1/product-category/microphone
// @access Private/Admin/Manager
const createNewMicrophoneController = expressAsyncController(
  async (
    request: CreateNewMicrophoneRequest,
    response: Response<ResourceRequestServerResponse<MicrophoneDocument>>,
    next: NextFunction
  ) => {
    const { microphoneSchema } = request.body;

    const microphoneDocument: MicrophoneDocument = await createNewMicrophoneService(
      microphoneSchema
    );
    if (!microphoneDocument) {
      return next(
        new createHttpError.InternalServerError("Microphone could not be created")
      );
    }

    response.status(201).json({
      message: `Successfully created new ${microphoneDocument.model} microphone`,
      resourceData: [microphoneDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new microphones bulk
// @route  POST /api/v1/product-category/microphone/dev
// @access Private/Admin/Manager
const createNewMicrophoneBulkController = expressAsyncController(
  async (
    request: CreateNewMicrophoneBulkRequest,
    response: Response<ResourceRequestServerResponse<MicrophoneDocument>>,
    next: NextFunction
  ) => {
    const { microphoneSchemas } = request.body;

    const newMicrophones = await Promise.all(
      microphoneSchemas.map(async (microphoneSchema) => {
        const newMicrophone = await createNewMicrophoneService(microphoneSchema);
        return newMicrophone;
      })
    );

    const successfullyCreatedMicrophones = newMicrophones.filter(
      (microphone) => microphone
    );

    if (successfullyCreatedMicrophones.length === microphoneSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedMicrophones.length} microphones`,
        resourceData: successfullyCreatedMicrophones,
      });
      return;
    }

    if (successfullyCreatedMicrophones.length === 0) {
      response.status(400).json({
        message: "Could not create any microphones",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        microphoneSchemas.length - successfullyCreatedMicrophones.length
      } microphones`,
      resourceData: successfullyCreatedMicrophones,
    });
    return;
  }
);

// @desc   Update microphones bulk
// @route  PATCH /api/v1/product-category/microphone/dev
// @access Private/Admin/Manager
const updateMicrophonesBulkController = expressAsyncController(
  async (
    request: UpdateMicrophonesBulkRequest,
    response: Response<ResourceRequestServerResponse<MicrophoneDocument>>,
    next: NextFunction
  ) => {
    const { microphoneFields } = request.body;

    const updatedMicrophones = await Promise.all(
      microphoneFields.map(async (microphoneField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = microphoneField;

        const updatedMicrophone = await updateMicrophoneByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedMicrophone;
      })
    );

    const successfullyUpdatedMicrophones = updatedMicrophones.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyUpdatedMicrophones.length === microphoneFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedMicrophones.length} microphones`,
        resourceData: successfullyUpdatedMicrophones,
      });
      return;
    }

    if (successfullyUpdatedMicrophones.length === 0) {
      response.status(400).json({
        message: "Could not update any microphones",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        microphoneFields.length - successfullyUpdatedMicrophones.length
      } microphones`,
      resourceData: successfullyUpdatedMicrophones,
    });
    return;
  }
);

// @desc   Get all microphones
// @route  GET /api/v1/product-category/microphone
// @access Private/Admin/Manager
const getQueriedMicrophonesController = expressAsyncController(
  async (
    request: GetQueriedMicrophonesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<MicrophoneDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalMicrophonesService({
        filter: filter as FilterQuery<MicrophoneDocument> | undefined,
      });
    }

    const microphones = await getQueriedMicrophonesService({
      filter: filter as FilterQuery<MicrophoneDocument> | undefined,
      projection: projection as QueryOptions<MicrophoneDocument>,
      options: options as QueryOptions<MicrophoneDocument>,
    });

    if (microphones.length === 0) {
      response.status(200).json({
        message: "No microphones that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved microphones",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: microphones,
    });
  }
);

// @desc   Get microphone by id
// @route  GET /api/v1/product-category/microphone/:microphoneId
// @access Private/Admin/Manager
const getMicrophoneByIdController = expressAsyncController(
  async (
    request: GetMicrophoneByIdRequest,
    response: Response<ResourceRequestServerResponse<MicrophoneDocument>>,
    next: NextFunction
  ) => {
    const microphoneId = request.params.microphoneId;

    // get microphone by id
    const microphone = await getMicrophoneByIdService(microphoneId);
    if (!microphone) {
      response.status(404).json({ message: "Microphone not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved microphone",
      resourceData: [microphone],
    });
  }
);

// @desc   Update a microphone by id
// @route  PUT /api/v1/product-category/microphone/:microphoneId
// @access Private/Admin/Manager
const updateMicrophoneByIdController = expressAsyncController(
  async (
    request: UpdateMicrophoneByIdRequest,
    response: Response<ResourceRequestServerResponse<MicrophoneDocument>>,
    next: NextFunction
  ) => {
    const { microphoneId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedMicrophone = await updateMicrophoneByIdService({
      _id: microphoneId,
      fields,
      updateOperator,
    });

    if (!updatedMicrophone) {
      return next(
        new createHttpError.InternalServerError("Microphone could not be updated")
      );
    }

    response.status(200).json({
      message: "Microphone updated successfully",
      resourceData: [updatedMicrophone],
    });
  }
);

// @desc   Delete all microphones
// @route  DELETE /api/v1/product-category/microphone
// @access Private/Admin/Manager
const deleteAllMicrophonesController = expressAsyncController(
  async (
    _request: DeleteAllMicrophonesRequest,
    response: Response<ResourceRequestServerResponse<MicrophoneDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllMicrophonesUploadedFileIdsService();

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

    const deleteMicrophonesResult: DeleteResult = await deleteAllMicrophonesService();
    if (deleteMicrophonesResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError("Microphones could not be deleted")
      );
    }

    response.status(200).json({ message: "All microphones deleted", resourceData: [] });
  }
);

// @desc   Delete a microphone by id
// @route  DELETE /api/v1/product-category/microphone/:microphoneId
// @access Private/Admin/Manager
const deleteAMicrophoneController = expressAsyncController(
  async (
    request: DeleteAMicrophoneRequest,
    response: Response<ResourceRequestServerResponse<MicrophoneDocument>>,
    next: NextFunction
  ) => {
    const microphoneId = request.params.microphoneId;

    const microphoneExists = await getMicrophoneByIdService(microphoneId);
    if (!microphoneExists) {
      response
        .status(404)
        .json({ message: "Microphone does not exist", resourceData: [] });
      return;
    }

    const uploadedFilesIds = [...microphoneExists.uploadedFilesIds];

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

    const deleteMicrophoneResult: DeleteResult = await deleteAMicrophoneService(
      microphoneId
    );
    if (deleteMicrophoneResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError("Microphone could not be deleted")
      );
    }

    response.status(200).json({ message: "Microphone deleted", resourceData: [] });
  }
);

export {
  createNewMicrophoneBulkController,
  createNewMicrophoneController,
  deleteAMicrophoneController,
  deleteAllMicrophonesController,
  getMicrophoneByIdController,
  getQueriedMicrophonesController,
  updateMicrophoneByIdController,
  updateMicrophonesBulkController,
};
