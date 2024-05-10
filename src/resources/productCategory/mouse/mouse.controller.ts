import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
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

// @desc   Create new mouse
// @route  POST /api/v1/product-category/mouse
// @access Private/Admin/Manager
const createNewMouseController = expressAsyncController(
  async (
    request: CreateNewMouseRequest,
    response: Response<ResourceRequestServerResponse<MouseDocument>>
  ) => {
    const { mouseSchema } = request.body;

    const mouseDocument: MouseDocument = await createNewMouseService(mouseSchema);

    if (!mouseDocument) {
      response.status(400).json({
        message: "Could not create new mouse",
        resourceData: [],
      });
      return;
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
    response: Response<ResourceRequestServerResponse<MouseDocument>>
  ) => {
    const { mouseSchemas } = request.body;

    const newMice = await Promise.all(
      mouseSchemas.map(async (mouseSchema) => {
        const newMouse = await createNewMouseService(mouseSchema);
        return newMouse;
      })
    );

    // filter out any mouses that were not created
    const successfullyCreatedMice = newMice.filter((mouse) => mouse);

    // check if any mouses were created
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
    response: Response<ResourceRequestServerResponse<MouseDocument>>
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

    // filter out any mouses that were not updated
    const successfullyUpdatedMice = updatedMice.filter(removeUndefinedAndNullValues);

    // check if any mouses were updated
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

    // get all mouses
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
    response: Response<ResourceRequestServerResponse<MouseDocument>>
  ) => {
    const mouseId = request.params.mouseId;

    // get mouse by id
    const mouse = await getMouseByIdService(mouseId);
    if (!mouse) {
      response.status(404).json({ message: "Mouse not found", resourceData: [] });
      return;
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
    response: Response<ResourceRequestServerResponse<MouseDocument>>
  ) => {
    const { mouseId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    // update mouse
    const updatedMouse = await updateMouseByIdService({
      _id: mouseId,
      fields,
      updateOperator,
    });

    if (!updatedMouse) {
      response.status(400).json({
        message: "Mouse could not be updated",
        resourceData: [],
      });
      return;
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
    response: Response<ResourceRequestServerResponse<MouseDocument>>
  ) => {
    // grab all mouses file upload ids
    const uploadedFilesIds = await returnAllMiceUploadedFileIdsService();

    // delete all file uploads associated with all mouses
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

    // delete all reviews associated with all mouses
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

    // delete all mouses
    const deleteMiceResult: DeleteResult = await deleteAllMiceService();

    if (deleteMiceResult.deletedCount === 0) {
      response.status(400).json({
        message: "All mouses could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
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
    response: Response<ResourceRequestServerResponse<MouseDocument>>
  ) => {
    const mouseId = request.params.mouseId;

    // check if mouse exists
    const mouseExists = await getMouseByIdService(mouseId);
    if (!mouseExists) {
      response.status(404).json({ message: "Mouse does not exist", resourceData: [] });
      return;
    }

    // find all file uploads associated with this mouse
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...mouseExists.uploadedFilesIds];

    // delete all file uploads associated with all mouses
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

    // delete all reviews associated with all mouses
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

    // delete mouse by id
    const deleteMouseResult: DeleteResult = await deleteAMouseService(mouseId);

    if (deleteMouseResult.deletedCount === 0) {
      response.status(400).json({
        message: "Mouse could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
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
