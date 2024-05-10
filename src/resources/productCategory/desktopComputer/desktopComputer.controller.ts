import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewDesktopComputerBulkRequest,
  CreateNewDesktopComputerRequest,
  DeleteADesktopComputerRequest,
  DeleteAllDesktopComputersRequest,
  GetDesktopComputerByIdRequest,
  GetQueriedDesktopComputersRequest,
  UpdateDesktopComputerByIdRequest,
  UpdateDesktopComputersBulkRequest,
} from "./desktopComputer.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { DesktopComputerDocument } from "./desktopComputer.model";

import {
  createNewDesktopComputerService,
  deleteADesktopComputerService,
  deleteAllDesktopComputersService,
  getDesktopComputerByIdService,
  getQueriedDesktopComputersService,
  getQueriedTotalDesktopComputersService,
  returnAllDesktopComputersUploadedFileIdsService,
  updateDesktopComputerByIdService,
} from "./desktopComputer.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new desktopComputer
// @route  POST /api/v1/product-category/desktopComputer
// @access Private/Admin/Manager
const createNewDesktopComputerController = expressAsyncController(
  async (
    request: CreateNewDesktopComputerRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>,
    next: NextFunction
  ) => {
    const { desktopComputerSchema } = request.body;

    const desktopComputerDocument: DesktopComputerDocument =
      await createNewDesktopComputerService(desktopComputerSchema);

    if (!desktopComputerDocument) {
      return next(
        new createHttpError.InternalServerError("Desktop Computer could not be created")
      );
    }

    response.status(201).json({
      message: `Successfully created new ${desktopComputerDocument.model} Desktop Computer`,
      resourceData: [desktopComputerDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new desktopComputers bulk
// @route  POST /api/v1/product-category/desktopComputer/dev
// @access Private/Admin/Manager
const createNewDesktopComputerBulkController = expressAsyncController(
  async (
    request: CreateNewDesktopComputerBulkRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>,
    next: NextFunction
  ) => {
    const { desktopComputerSchemas } = request.body;

    const newDesktopComputers = await Promise.all(
      desktopComputerSchemas.map(async (desktopComputerSchema) => {
        const newDesktopComputer = await createNewDesktopComputerService(
          desktopComputerSchema
        );
        return newDesktopComputer;
      })
    );

    const successfullyCreatedDesktopComputers = newDesktopComputers.filter(
      (desktopComputer) => desktopComputer
    );

    if (successfullyCreatedDesktopComputers.length === desktopComputerSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedDesktopComputers.length} Desktop Computers`,
        resourceData: successfullyCreatedDesktopComputers,
      });
      return;
    }

    if (successfullyCreatedDesktopComputers.length === 0) {
      response.status(400).json({
        message: "Could not create any Desktop Computers",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        desktopComputerSchemas.length - successfullyCreatedDesktopComputers.length
      } Desktop Computers`,
      resourceData: successfullyCreatedDesktopComputers,
    });
    return;
  }
);

// @desc   Update desktopComputers bulk
// @route  PATCH /api/v1/product-category/desktopComputer/dev
// @access Private/Admin/Manager
const updateDesktopComputersBulkController = expressAsyncController(
  async (
    request: UpdateDesktopComputersBulkRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>,
    next: NextFunction
  ) => {
    const { desktopComputerFields } = request.body;

    const updatedDesktopComputers = await Promise.all(
      desktopComputerFields.map(async (desktopComputerField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = desktopComputerField;

        const updatedDesktopComputer = await updateDesktopComputerByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedDesktopComputer;
      })
    );

    const successfullyUpdatedDesktopComputers = updatedDesktopComputers.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyUpdatedDesktopComputers.length === desktopComputerFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedDesktopComputers.length} Desktop Computers`,
        resourceData: successfullyUpdatedDesktopComputers,
      });
      return;
    }

    if (successfullyUpdatedDesktopComputers.length === 0) {
      response.status(400).json({
        message: "Could not update any Desktop Computers",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        desktopComputerFields.length - successfullyUpdatedDesktopComputers.length
      } Desktop Computers`,
      resourceData: successfullyUpdatedDesktopComputers,
    });
    return;
  }
);

// @desc   Get all desktopComputers
// @route  GET /api/v1/product-category/desktopComputer
// @access Private/Admin/Manager
const getQueriedDesktopComputersController = expressAsyncController(
  async (
    request: GetQueriedDesktopComputersRequest,
    response: Response<GetQueriedResourceRequestServerResponse<DesktopComputerDocument>>,
    next: NextFunction
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalDesktopComputersService({
        filter: filter as FilterQuery<DesktopComputerDocument> | undefined,
      });
    }

    const desktopComputers = await getQueriedDesktopComputersService({
      filter: filter as FilterQuery<DesktopComputerDocument> | undefined,
      projection: projection as QueryOptions<DesktopComputerDocument>,
      options: options as QueryOptions<DesktopComputerDocument>,
    });

    if (desktopComputers.length === 0) {
      response.status(200).json({
        message: "No Desktop Computers that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved Desktop Computers",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: desktopComputers,
    });
  }
);

// @desc   Get desktopComputer by id
// @route  GET /api/v1/product-category/desktopComputer/:desktopComputerId
// @access Private/Admin/Manager
const getDesktopComputerByIdController = expressAsyncController(
  async (
    request: GetDesktopComputerByIdRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>,
    next: NextFunction
  ) => {
    const desktopComputerId = request.params.desktopComputerId;

    const desktopComputer = await getDesktopComputerByIdService(desktopComputerId);
    if (!desktopComputer) {
      return next(new createHttpError.NotFound("Desktop Computer could not be found"));
    }

    response.status(200).json({
      message: "Successfully retrieved Desktop Computer",
      resourceData: [desktopComputer],
    });
  }
);

// @desc   Update a desktopComputer by id
// @route  PUT /api/v1/product-category/desktopComputer/:desktopComputerId
// @access Private/Admin/Manager
const updateDesktopComputerByIdController = expressAsyncController(
  async (
    request: UpdateDesktopComputerByIdRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>,
    next: NextFunction
  ) => {
    const { desktopComputerId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedDesktopComputer = await updateDesktopComputerByIdService({
      _id: desktopComputerId,
      fields,
      updateOperator,
    });

    if (!updatedDesktopComputer) {
      return next(
        new createHttpError.InternalServerError("Desktop Computer could not be updated")
      );
    }

    response.status(200).json({
      message: "Desktop Computer updated successfully",
      resourceData: [updatedDesktopComputer],
    });
  }
);

// @desc   Delete all desktopComputers
// @route  DELETE /api/v1/product-category/desktopComputer
// @access Private/Admin/Manager
const deleteAllDesktopComputersController = expressAsyncController(
  async (
    _request: DeleteAllDesktopComputersRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllDesktopComputersUploadedFileIdsService();

    const deletedFileUploads = await Promise.all(
      uploadedFilesIds.map(
        async (fileUploadId) => await deleteFileUploadByIdService(fileUploadId)
      )
    );

    if (
      deletedFileUploads.some((deletedFileUpload) => deletedFileUpload.deletedCount === 0)
    ) {
      return next(
        new createHttpError.InternalServerError("Some File uploads could not be deleted")
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

    const deleteDesktopComputersResult: DeleteResult =
      await deleteAllDesktopComputersService();

    if (deleteDesktopComputersResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError("Desktop Computers could not be deleted")
      );
    }

    response
      .status(200)
      .json({ message: "All Desktop Computers deleted", resourceData: [] });
  }
);

// @desc   Delete a desktopComputer by id
// @route  DELETE /api/v1/product-category/desktopComputer/:desktopComputerId
// @access Private/Admin/Manager
const deleteADesktopComputerController = expressAsyncController(
  async (
    request: DeleteADesktopComputerRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>,
    next: NextFunction
  ) => {
    const desktopComputerId = request.params.desktopComputerId;

    const desktopComputerExists = await getDesktopComputerByIdService(desktopComputerId);
    if (!desktopComputerExists) {
      return next(new createHttpError.NotFound("Desktop Computer could not be found"));
    }

    const uploadedFilesIds = [...desktopComputerExists.uploadedFilesIds];

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

    const deleteDesktopComputerResult: DeleteResult = await deleteADesktopComputerService(
      desktopComputerId
    );

    if (deleteDesktopComputerResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError("Desktop Computer could not be deleted")
      );
    }

    response.status(200).json({ message: "Desktop Computer deleted", resourceData: [] });
  }
);

export {
  createNewDesktopComputerBulkController,
  createNewDesktopComputerController,
  deleteADesktopComputerController,
  deleteAllDesktopComputersController,
  getDesktopComputerByIdController,
  getQueriedDesktopComputersController,
  updateDesktopComputerByIdController,
  updateDesktopComputersBulkController,
};
