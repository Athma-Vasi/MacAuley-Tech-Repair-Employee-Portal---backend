import expressAsyncController from "express-async-handler";
import createHttpError from "http-errors";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response, NextFunction } from "express";
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

// @desc   Create new smartphone
// @route  POST /api/v1/product-category/smartphone
// @access Private/Admin/Manager
const createNewSmartphoneController = expressAsyncController(
  async (
    request: CreateNewSmartphoneRequest,
    next: NextFunction,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    const { smartphoneSchema } = request.body;

    const smartphoneDocument: SmartphoneDocument = await createNewSmartphoneService(
      smartphoneSchema
    );

    if (!smartphoneDocument) {
      response.status(400).json({
        message: "Could not create new smartphone",
        resourceData: [],
      });
      return;
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
    next: NextFunction,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    const { smartphoneSchemas } = request.body;

    const newSmartphones = await Promise.all(
      smartphoneSchemas.map(async (smartphoneSchema) => {
        const newSmartphone = await createNewSmartphoneService(smartphoneSchema);
        return newSmartphone;
      })
    );

    // filter out any smartphones that were not created
    const successfullyCreatedSmartphones = newSmartphones.filter(
      (smartphone) => smartphone
    );

    // check if any smartphones were created
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
    next: NextFunction,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>
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

    // filter out any smartphones that were not updated
    const successfullyUpdatedSmartphones = updatedSmartphones.filter(
      removeUndefinedAndNullValues
    );

    // check if any smartphones were updated
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

    // get all smartphones
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
    next: NextFunction,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    const smartphoneId = request.params.smartphoneId;

    // get smartphone by id
    const smartphone = await getSmartphoneByIdService(smartphoneId);
    if (!smartphone) {
      response.status(404).json({ message: "Smartphone not found", resourceData: [] });
      return;
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
    next: NextFunction,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    const { smartphoneId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    // update smartphone
    const updatedSmartphone = await updateSmartphoneByIdService({
      _id: smartphoneId,
      fields,
      updateOperator,
    });

    if (!updatedSmartphone) {
      response.status(400).json({
        message: "Smartphone could not be updated",
        resourceData: [],
      });
      return;
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
    next: NextFunction,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    // grab all smartphones file upload ids
    const uploadedFilesIds = await returnAllSmartphonesUploadedFileIdsService();

    // delete all file uploads associated with all smartphones
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

    // delete all reviews associated with all smartphones
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

    // delete all smartphones
    const deleteSmartphonesResult: DeleteResult = await deleteAllSmartphonesService();

    if (deleteSmartphonesResult.deletedCount === 0) {
      response.status(400).json({
        message: "All smartphones could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
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
    next: NextFunction,
    response: Response<ResourceRequestServerResponse<SmartphoneDocument>>
  ) => {
    const smartphoneId = request.params.smartphoneId;

    // check if smartphone exists
    const smartphoneExists = await getSmartphoneByIdService(smartphoneId);
    if (!smartphoneExists) {
      response
        .status(404)
        .json({ message: "Smartphone does not exist", resourceData: [] });
      return;
    }

    // find all file uploads associated with this smartphone
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...smartphoneExists.uploadedFilesIds];

    // delete all file uploads associated with all smartphones
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

    // delete all reviews associated with all smartphones
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

    // delete smartphone by id
    const deleteSmartphoneResult: DeleteResult = await deleteASmartphoneService(
      smartphoneId
    );

    if (deleteSmartphoneResult.deletedCount === 0) {
      response.status(400).json({
        message: "Smartphone could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
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
