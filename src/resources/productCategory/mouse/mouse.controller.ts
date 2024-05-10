import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewMouseBulkRequest,
  CreateNewMouseRequest,
  DeleteAMouseRequest,
  DeleteAllMiceRequest,
  GetMouseByIdRequest,
  GetQueriedMiceRequest,
  UpdateMouseByIdRequest,
  UpdateMiceBulkRequest,
} from "./mouse.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { MouseDocument } from "./mouse.model";

import {
  createNewMouseService,
  deleteAMouseService,
  deleteAllMiceService,
  getMouseByIdService,
  getQueriedMiceService,
  getQueriedTotalMiceService,
  returnAllMiceUploadedFileIdsService,
  updateMouseByIdService,
} from "./mouse.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new mouse
// @route  POST /api/v1/product-category/mouse
// @access Private/Admin/Manager
const createNewMouseController = expressAsyncController(
  async (
    request: CreateNewMouseRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>,
    next: NextFunction
  ) => {
    const { mouseSchema } = request.body;

    const mouseDocument: MouseDocument = await createNewMouseService(mouseSchema);
    if (!mouseDocument) {
      return next(new createHttpError.InternalServerError("Mouse could not be created"));
    }

    response.status(201).json({
      message: `Successfully created new ${mouseDocument.model} mouse`,
      resourceData: [mouseDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new mouses bulk
// @route  POST /api/v1/product-category/mouse/dev
// @access Private/Admin/Manager
const createNewMouseBulkController = expressAsyncController(
  async (
    request: CreateNewMouseBulkRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>,
    next: NextFunction
  ) => {
    const { mouseSchemas } = request.body;

    const newMice = await Promise.all(
      mouseSchemas.map(async (mouseSchema) => {
        const newMouse = await createNewMouseService(mouseSchema);
        return newMouse;
      })
    );

    const successfullyCreatedMice = newMice.filter((mouse) => mouse);

    if (successfullyCreatedMice.length === mouseSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedMice.length} mouses`,
        resourceData: successfullyCreatedMice,
      });
      return;
    }

    if (successfullyCreatedMice.length === 0) {
      response.status(400).json({
        message: "Could not create any mouses",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        mouseSchemas.length - successfullyCreatedMice.length
      } mouses`,
      resourceData: successfullyCreatedMice,
    });
    return;
  }
);

// @desc   Update mouses bulk
// @route  PATCH /api/v1/product-category/mouse/dev
// @access Private/Admin/Manager
const updateMiceBulkController = expressAsyncController(
  async (
    request: UpdateMiceBulkRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>,
    next: NextFunction
  ) => {
    const { mouseFields } = request.body;

    const updatedMice = await Promise.all(
      mouseFields.map(async (mouseField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = mouseField;

        const updatedMouse = await updateMouseByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedMouse;
      })
    );

    const successfullyUpdatedMice = updatedMice.filter(removeUndefinedAndNullValues);

    if (successfullyUpdatedMice.length === mouseFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedMice.length} mouses`,
        resourceData: successfullyUpdatedMice,
      });
      return;
    }

    if (successfullyUpdatedMice.length === 0) {
      response.status(400).json({
        message: "Could not update any mouses",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        mouseFields.length - successfullyUpdatedMice.length
      } mouses`,
      resourceData: successfullyUpdatedMice,
    });
    return;
  }
);

// @desc   Get all mouses
// @route  GET /api/v1/product-category/mouse
// @access Private/Admin/Manager
const getQueriedMiceController = expressAsyncController(
  async (
    request: GetQueriedMiceRequest,
    response: Response<GetQueriedResourceRequestServerResponse<MouseDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalMiceService({
        filter: filter as FilterQuery<MouseDocument> | undefined,
      });
    }

    const mouses = await getQueriedMiceService({
      filter: filter as FilterQuery<MouseDocument> | undefined,
      projection: projection as QueryOptions<MouseDocument>,
      options: options as QueryOptions<MouseDocument>,
    });

    if (mouses.length === 0) {
      response.status(200).json({
        message: "No mouses that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved mouses",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: mouses,
    });
  }
);

// @desc   Get mouse by id
// @route  GET /api/v1/product-category/mouse/:mouseId
// @access Private/Admin/Manager
const getMouseByIdController = expressAsyncController(
  async (
    request: GetMouseByIdRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>,
    next: NextFunction
  ) => {
    const mouseId = request.params.mouseId;

    const mouse = await getMouseByIdService(mouseId);
    if (!mouse) {
      return next(new createHttpError.NotFound("Mouse does not exist"));
    }

    response.status(200).json({
      message: "Successfully retrieved mouse",
      resourceData: [mouse],
    });
  }
);

// @desc   Update a mouse by id
// @route  PUT /api/v1/product-category/mouse/:mouseId
// @access Private/Admin/Manager
const updateMouseByIdController = expressAsyncController(
  async (
    request: UpdateMouseByIdRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>,
    next: NextFunction
  ) => {
    const { mouseId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedMouse = await updateMouseByIdService({
      _id: mouseId,
      fields,
      updateOperator,
    });

    if (!updatedMouse) {
      return next(new createHttpError.InternalServerError("Mouse could not be updated"));
    }

    response.status(200).json({
      message: "Mouse updated successfully",
      resourceData: [updatedMouse],
    });
  }
);

// @desc   Delete all mouses
// @route  DELETE /api/v1/product-category/mouse
// @access Private/Admin/Manager
const deleteAllMiceController = expressAsyncController(
  async (
    _request: DeleteAllMiceRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllMiceUploadedFileIdsService();

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

    const deleteMiceResult: DeleteResult = await deleteAllMiceService();
    if (deleteMiceResult.deletedCount === 0) {
      return next(new createHttpError.InternalServerError("Could not delete all mouses"));
    }

    response.status(200).json({ message: "All mouses deleted", resourceData: [] });
  }
);

// @desc   Delete a mouse by id
// @route  DELETE /api/v1/product-category/mouse/:mouseId
// @access Private/Admin/Manager
const deleteAMouseController = expressAsyncController(
  async (
    request: DeleteAMouseRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>,
    next: NextFunction
  ) => {
    const mouseId = request.params.mouseId;

    const mouseExists = await getMouseByIdService(mouseId);
    if (!mouseExists) {
      response.status(404).json({ message: "Mouse does not exist", resourceData: [] });
      return;
    }

    const uploadedFilesIds = [...mouseExists.uploadedFilesIds];

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

    const deleteMouseResult: DeleteResult = await deleteAMouseService(mouseId);
    if (deleteMouseResult.deletedCount === 0) {
      return next(new createHttpError.InternalServerError("Could not delete mouse"));
    }

    response.status(200).json({ message: "Mouse deleted", resourceData: [] });
  }
);

export {
  createNewMouseBulkController,
  createNewMouseController,
  deleteAMouseController,
  deleteAllMiceController,
  getMouseByIdController,
  getQueriedMiceController,
  updateMouseByIdController,
  updateMiceBulkController,
};
