import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewKeyboardBulkRequest,
  CreateNewKeyboardRequest,
  DeleteAKeyboardRequest,
  DeleteAllKeyboardsRequest,
  GetKeyboardByIdRequest,
  GetQueriedKeyboardsRequest,
  UpdateKeyboardByIdRequest,
  UpdateKeyboardsBulkRequest,
} from "./keyboard.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { KeyboardDocument } from "./keyboard.model";

import {
  createNewKeyboardService,
  deleteAKeyboardService,
  deleteAllKeyboardsService,
  getKeyboardByIdService,
  getQueriedKeyboardsService,
  getQueriedTotalKeyboardsService,
  returnAllKeyboardsUploadedFileIdsService,
  updateKeyboardByIdService,
} from "./keyboard.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new keyboard
// @route  POST /api/v1/product-category/keyboard
// @access Private/Admin/Manager
const createNewKeyboardController = expressAsyncController(
  async (
    request: CreateNewKeyboardRequest,
    response: Response<ResourceRequestServerResponse<KeyboardDocument>>,
    next: NextFunction
  ) => {
    const { keyboardSchema } = request.body;

    const keyboardDocument: KeyboardDocument = await createNewKeyboardService(
      keyboardSchema
    );

    if (!keyboardDocument) {
      return next(
        new createHttpError.InternalServerError("Could not create new keyboard")
      );
    }

    response.status(201).json({
      message: `Successfully created new ${keyboardDocument.model} keyboard`,
      resourceData: [keyboardDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new keyboards bulk
// @route  POST /api/v1/product-category/keyboard/dev
// @access Private/Admin/Manager
const createNewKeyboardBulkController = expressAsyncController(
  async (
    request: CreateNewKeyboardBulkRequest,
    response: Response<ResourceRequestServerResponse<KeyboardDocument>>,
    next: NextFunction
  ) => {
    const { keyboardSchemas } = request.body;

    const newKeyboards = await Promise.all(
      keyboardSchemas.map(async (keyboardSchema) => {
        const newKeyboard = await createNewKeyboardService(keyboardSchema);
        return newKeyboard;
      })
    );

    const successfullyCreatedKeyboards = newKeyboards.filter((keyboard) => keyboard);

    if (successfullyCreatedKeyboards.length === keyboardSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedKeyboards.length} keyboards`,
        resourceData: successfullyCreatedKeyboards,
      });
      return;
    }

    if (successfullyCreatedKeyboards.length === 0) {
      response.status(400).json({
        message: "Could not create any keyboards",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        keyboardSchemas.length - successfullyCreatedKeyboards.length
      } keyboards`,
      resourceData: successfullyCreatedKeyboards,
    });
    return;
  }
);

// @desc   Update keyboards bulk
// @route  PATCH /api/v1/product-category/keyboard/dev
// @access Private/Admin/Manager
const updateKeyboardsBulkController = expressAsyncController(
  async (
    request: UpdateKeyboardsBulkRequest,
    response: Response<ResourceRequestServerResponse<KeyboardDocument>>,
    next: NextFunction
  ) => {
    const { keyboardFields } = request.body;

    const updatedKeyboards = await Promise.all(
      keyboardFields.map(async (keyboardField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = keyboardField;

        const updatedKeyboard = await updateKeyboardByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedKeyboard;
      })
    );

    const successfullyUpdatedKeyboards = updatedKeyboards.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyUpdatedKeyboards.length === keyboardFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedKeyboards.length} keyboards`,
        resourceData: successfullyUpdatedKeyboards,
      });
      return;
    }

    if (successfullyUpdatedKeyboards.length === 0) {
      response.status(400).json({
        message: "Could not update any keyboards",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        keyboardFields.length - successfullyUpdatedKeyboards.length
      } keyboards`,
      resourceData: successfullyUpdatedKeyboards,
    });
    return;
  }
);

// @desc   Get all keyboards
// @route  GET /api/v1/product-category/keyboard
// @access Private/Admin/Manager
const getQueriedKeyboardsController = expressAsyncController(
  async (
    request: GetQueriedKeyboardsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<KeyboardDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalKeyboardsService({
        filter: filter as FilterQuery<KeyboardDocument> | undefined,
      });
    }

    const keyboards = await getQueriedKeyboardsService({
      filter: filter as FilterQuery<KeyboardDocument> | undefined,
      projection: projection as QueryOptions<KeyboardDocument>,
      options: options as QueryOptions<KeyboardDocument>,
    });

    if (keyboards.length === 0) {
      response.status(200).json({
        message: "No keyboards that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved keyboards",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: keyboards,
    });
  }
);

// @desc   Get keyboard by id
// @route  GET /api/v1/product-category/keyboard/:keyboardId
// @access Private/Admin/Manager
const getKeyboardByIdController = expressAsyncController(
  async (
    request: GetKeyboardByIdRequest,
    response: Response<ResourceRequestServerResponse<KeyboardDocument>>,
    next: NextFunction
  ) => {
    const keyboardId = request.params.keyboardId;

    const keyboard = await getKeyboardByIdService(keyboardId);
    if (!keyboard) {
      return next(
        new createHttpError.NotFound(`Keyboard with id ${keyboardId} does not exist`)
      );
    }

    response.status(200).json({
      message: "Successfully retrieved keyboard",
      resourceData: [keyboard],
    });
  }
);

// @desc   Update a keyboard by id
// @route  PUT /api/v1/product-category/keyboard/:keyboardId
// @access Private/Admin/Manager
const updateKeyboardByIdController = expressAsyncController(
  async (
    request: UpdateKeyboardByIdRequest,
    response: Response<ResourceRequestServerResponse<KeyboardDocument>>,
    next: NextFunction
  ) => {
    const { keyboardId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedKeyboard = await updateKeyboardByIdService({
      _id: keyboardId,
      fields,
      updateOperator,
    });

    if (!updatedKeyboard) {
      return next(new createHttpError.InternalServerError("Could not update keyboard"));
    }

    response.status(200).json({
      message: "Keyboard updated successfully",
      resourceData: [updatedKeyboard],
    });
  }
);

// @desc   Delete all keyboards
// @route  DELETE /api/v1/product-category/keyboard
// @access Private/Admin/Manager
const deleteAllKeyboardsController = expressAsyncController(
  async (
    _request: DeleteAllKeyboardsRequest,
    response: Response<ResourceRequestServerResponse<KeyboardDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllKeyboardsUploadedFileIdsService();

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

    const deleteKeyboardsResult: DeleteResult = await deleteAllKeyboardsService();
    if (deleteKeyboardsResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError("Keyboards could not be deleted")
      );
    }

    response.status(200).json({ message: "All keyboards deleted", resourceData: [] });
  }
);

// @desc   Delete a keyboard by id
// @route  DELETE /api/v1/product-category/keyboard/:keyboardId
// @access Private/Admin/Manager
const deleteAKeyboardController = expressAsyncController(
  async (
    request: DeleteAKeyboardRequest,
    response: Response<ResourceRequestServerResponse<KeyboardDocument>>,
    next: NextFunction
  ) => {
    const keyboardId = request.params.keyboardId;

    const keyboardExists = await getKeyboardByIdService(keyboardId);
    if (!keyboardExists) {
      return next(
        new createHttpError.NotFound(`Keyboard with id ${keyboardId} does not exist`)
      );
    }

    const uploadedFilesIds = [...keyboardExists.uploadedFilesIds];

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

    const deleteKeyboardResult: DeleteResult = await deleteAKeyboardService(keyboardId);
    if (deleteKeyboardResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError("Keyboard could not be deleted")
      );
    }

    response.status(200).json({ message: "Keyboard deleted", resourceData: [] });
  }
);

export {
  createNewKeyboardBulkController,
  createNewKeyboardController,
  deleteAKeyboardController,
  deleteAllKeyboardsController,
  getKeyboardByIdController,
  getQueriedKeyboardsController,
  updateKeyboardByIdController,
  updateKeyboardsBulkController,
};
