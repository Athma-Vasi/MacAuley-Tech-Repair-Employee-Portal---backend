import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
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

// @desc   Create new desktopComputer
// @route  POST /api/v1/product-category/desktopComputer
// @access Private/Admin/Manager
const createNewDesktopComputerHandler = expressAsyncHandler(
  async (
    request: CreateNewDesktopComputerRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>
  ) => {
    const { desktopComputerSchema } = request.body;

    const desktopComputerDocument: DesktopComputerDocument =
      await createNewDesktopComputerService(desktopComputerSchema);

    if (!desktopComputerDocument) {
      response.status(400).json({
        message: "Could not create new Desktop Computer",
        resourceData: [],
      });
      return;
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
const createNewDesktopComputerBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewDesktopComputerBulkRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>
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

    // filter out any desktopComputers that were not created
    const successfullyCreatedDesktopComputers = newDesktopComputers.filter(
      (desktopComputer) => desktopComputer
    );

    // check if any desktopComputers were created
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
const updateDesktopComputersBulkHandler = expressAsyncHandler(
  async (
    request: UpdateDesktopComputersBulkRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>
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

    // filter out any desktopComputers that were not updated
    const successfullyUpdatedDesktopComputers = updatedDesktopComputers.filter(
      removeUndefinedAndNullValues
    );

    // check if any desktopComputers were updated
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
const getQueriedDesktopComputersHandler = expressAsyncHandler(
  async (
    request: GetQueriedDesktopComputersRequest,
    response: Response<GetQueriedResourceRequestServerResponse<DesktopComputerDocument>>
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

    // get all desktopComputers
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
const getDesktopComputerByIdHandler = expressAsyncHandler(
  async (
    request: GetDesktopComputerByIdRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>
  ) => {
    const desktopComputerId = request.params.desktopComputerId;

    // get desktopComputer by id
    const desktopComputer = await getDesktopComputerByIdService(desktopComputerId);
    if (!desktopComputer) {
      response
        .status(404)
        .json({ message: "Desktop Computer not found", resourceData: [] });
      return;
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
const updateDesktopComputerByIdHandler = expressAsyncHandler(
  async (
    request: UpdateDesktopComputerByIdRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>
  ) => {
    const { desktopComputerId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    // update desktopComputer
    const updatedDesktopComputer = await updateDesktopComputerByIdService({
      _id: desktopComputerId,
      fields,
      updateOperator,
    });

    if (!updatedDesktopComputer) {
      response.status(400).json({
        message: "Desktop Computer could not be updated",
        resourceData: [],
      });
      return;
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
const deleteAllDesktopComputersHandler = expressAsyncHandler(
  async (
    _request: DeleteAllDesktopComputersRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>
  ) => {
    // grab all desktopComputers file upload ids
    const uploadedFilesIds = await returnAllDesktopComputersUploadedFileIdsService();

    // delete all file uploads associated with all desktopComputers
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

    // delete all reviews associated with all desktopComputers
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

    // delete all desktopComputers
    const deleteDesktopComputersResult: DeleteResult =
      await deleteAllDesktopComputersService();

    if (deleteDesktopComputersResult.deletedCount === 0) {
      response.status(400).json({
        message: "All Desktop Computers could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
    }

    response
      .status(200)
      .json({ message: "All Desktop Computers deleted", resourceData: [] });
  }
);

// @desc   Delete a desktopComputer by id
// @route  DELETE /api/v1/product-category/desktopComputer/:desktopComputerId
// @access Private/Admin/Manager
const deleteADesktopComputerHandler = expressAsyncHandler(
  async (
    request: DeleteADesktopComputerRequest,
    response: Response<ResourceRequestServerResponse<DesktopComputerDocument>>
  ) => {
    const desktopComputerId = request.params.desktopComputerId;

    // check if desktopComputer exists
    const desktopComputerExists = await getDesktopComputerByIdService(desktopComputerId);
    if (!desktopComputerExists) {
      response
        .status(404)
        .json({ message: "Desktop Computer does not exist", resourceData: [] });
      return;
    }

    // find all file uploads associated with this desktopComputer
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...desktopComputerExists.uploadedFilesIds];

    // delete all file uploads associated with all desktopComputers
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

    // delete all reviews associated with all desktopComputers
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
    // delete desktopComputer by id
    const deleteDesktopComputerResult: DeleteResult = await deleteADesktopComputerService(
      desktopComputerId
    );

    if (deleteDesktopComputerResult.deletedCount === 0) {
      response.status(400).json({
        message: "Desktop Computer could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: "Desktop Computer deleted", resourceData: [] });
  }
);

export {
  createNewDesktopComputerBulkHandler,
  createNewDesktopComputerHandler,
  deleteADesktopComputerHandler,
  deleteAllDesktopComputersHandler,
  getDesktopComputerByIdHandler,
  getQueriedDesktopComputersHandler,
  updateDesktopComputerByIdHandler,
  updateDesktopComputersBulkHandler,
};
