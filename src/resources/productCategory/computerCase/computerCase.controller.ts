import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewComputerCaseBulkRequest,
  CreateNewComputerCaseRequest,
  DeleteAComputerCaseRequest,
  DeleteAllComputerCasesRequest,
  GetComputerCaseByIdRequest,
  GetQueriedComputerCasesRequest,
  UpdateComputerCaseByIdRequest,
  UpdateComputerCasesBulkRequest,
} from "./computerCase.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { ComputerCaseDocument } from "./computerCase.model";

import {
  createNewComputerCaseService,
  deleteAComputerCaseService,
  deleteAllComputerCasesService,
  getComputerCaseByIdService,
  getQueriedComputerCasesService,
  getQueriedTotalComputerCasesService,
  returnAllComputerCasesUploadedFileIdsService,
  updateComputerCaseByIdService,
} from "./computerCase.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";

// @desc   Create new computerCase
// @route  POST /api/v1/product-category/computerCase
// @access Private/Admin/Manager
const createNewComputerCaseHandler = expressAsyncHandler(
  async (
    request: CreateNewComputerCaseRequest,
    response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    const { computerCaseSchema } = request.body;

    const computerCaseDocument: ComputerCaseDocument = await createNewComputerCaseService(
      computerCaseSchema
    );

    if (!computerCaseDocument) {
      response.status(400).json({
        message: "Could not create new computerCase",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${computerCaseDocument.model} computerCase`,
      resourceData: [computerCaseDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new computerCases bulk
// @route  POST /api/v1/product-category/computerCase/dev
// @access Private/Admin/Manager
const createNewComputerCaseBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewComputerCaseBulkRequest,
    response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    const { computerCaseSchemas } = request.body;

    const newComputerCases = await Promise.all(
      computerCaseSchemas.map(async (computerCaseSchema) => {
        const newComputerCase = await createNewComputerCaseService(computerCaseSchema);
        return newComputerCase;
      })
    );

    // filter out any computerCases that were not created
    const successfullyCreatedComputerCases = newComputerCases.filter(
      (computerCase) => computerCase
    );

    // check if any computerCases were created
    if (successfullyCreatedComputerCases.length === computerCaseSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedComputerCases.length} computerCases`,
        resourceData: successfullyCreatedComputerCases,
      });
      return;
    }

    if (successfullyCreatedComputerCases.length === 0) {
      response.status(400).json({
        message: "Could not create any computerCases",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        computerCaseSchemas.length - successfullyCreatedComputerCases.length
      } computerCases`,
      resourceData: successfullyCreatedComputerCases,
    });
    return;
  }
);

// @desc   Update computerCases bulk
// @route  PATCH /api/v1/product-category/computerCase/dev
// @access Private/Admin/Manager
const updateComputerCasesBulkHandler = expressAsyncHandler(
  async (
    request: UpdateComputerCasesBulkRequest,
    response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    const { computerCaseFields } = request.body;

    const updatedComputerCases = await Promise.all(
      computerCaseFields.map(async (computerCaseField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = computerCaseField;

        const updatedComputerCase = await updateComputerCaseByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedComputerCase;
      })
    );

    // filter out any computerCases that were not updated
    const successfullyUpdatedComputerCases = updatedComputerCases.filter(
      removeUndefinedAndNullValues
    );

    // check if any computerCases were updated
    if (successfullyUpdatedComputerCases.length === computerCaseFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedComputerCases.length} computerCases`,
        resourceData: successfullyUpdatedComputerCases,
      });
      return;
    }

    if (successfullyUpdatedComputerCases.length === 0) {
      response.status(400).json({
        message: "Could not update any computerCases",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        computerCaseFields.length - successfullyUpdatedComputerCases.length
      } computerCases`,
      resourceData: successfullyUpdatedComputerCases,
    });
    return;
  }
);

// @desc   Get all computerCases
// @route  GET /api/v1/product-category/computerCase
// @access Private/Admin/Manager
const getQueriedComputerCasesHandler = expressAsyncHandler(
  async (
    request: GetQueriedComputerCasesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalComputerCasesService({
        filter: filter as FilterQuery<ComputerCaseDocument> | undefined,
      });
    }

    // get all computerCases
    const computerCases = await getQueriedComputerCasesService({
      filter: filter as FilterQuery<ComputerCaseDocument> | undefined,
      projection: projection as QueryOptions<ComputerCaseDocument>,
      options: options as QueryOptions<ComputerCaseDocument>,
    });
    if (computerCases.length === 0) {
      response.status(200).json({
        message: "No computerCases that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved computerCases",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: computerCases,
    });
  }
);

// @desc   Get computerCase by id
// @route  GET /api/v1/product-category/computerCase/:computerCaseId
// @access Private/Admin/Manager
const getComputerCaseByIdHandler = expressAsyncHandler(
  async (
    request: GetComputerCaseByIdRequest,
    response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    const computerCaseId = request.params.computerCaseId;

    // get computerCase by id
    const computerCase = await getComputerCaseByIdService(computerCaseId);
    if (!computerCase) {
      response.status(404).json({ message: "ComputerCase not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved computerCase",
      resourceData: [computerCase],
    });
  }
);

// @desc   Update a computerCase by id
// @route  PUT /api/v1/product-category/computerCase/:computerCaseId
// @access Private/Admin/Manager
const updateComputerCaseByIdHandler = expressAsyncHandler(
  async (
    request: UpdateComputerCaseByIdRequest,
    response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    const { computerCaseId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    // update computerCase
    const updatedComputerCase = await updateComputerCaseByIdService({
      _id: computerCaseId,
      fields,
      updateOperator,
    });

    if (!updatedComputerCase) {
      response.status(400).json({
        message: "ComputerCase could not be updated",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "ComputerCase updated successfully",
      resourceData: [updatedComputerCase],
    });
  }
);

// @desc   Delete all computerCases
// @route  DELETE /api/v1/product-category/computerCase
// @access Private/Admin/Manager
const deleteAllComputerCasesHandler = expressAsyncHandler(
  async (
    _request: DeleteAllComputerCasesRequest,
    response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    // grab all computerCases file upload ids
    const uploadedFilesIds = await returnAllComputerCasesUploadedFileIdsService();

    // delete all file uploads associated with all computerCases
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

    // delete all reviews associated with all computerCases
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

    // delete all computerCases
    const deleteComputerCasesResult: DeleteResult = await deleteAllComputerCasesService();

    if (deleteComputerCasesResult.deletedCount === 0) {
      response.status(400).json({
        message: "All computerCases could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: "All computerCases deleted", resourceData: [] });
  }
);

// @desc   Delete a computerCase by id
// @route  DELETE /api/v1/product-category/computerCase/:computerCaseId
// @access Private/Admin/Manager
const deleteAComputerCaseHandler = expressAsyncHandler(
  async (
    request: DeleteAComputerCaseRequest,
    response: Response<ResourceRequestServerResponse<ComputerCaseDocument>>
  ) => {
    const computerCaseId = request.params.computerCaseId;

    // check if computerCase exists
    const computerCaseExists = await getComputerCaseByIdService(computerCaseId);
    if (!computerCaseExists) {
      response
        .status(404)
        .json({ message: "Computer Case does not exist", resourceData: [] });
      return;
    }

    // find all file uploads associated with this computerCase
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...computerCaseExists.uploadedFilesIds];

    // delete all file uploads associated with all computerCases
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

    // delete all reviews associated with all computerCases
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

    // delete computerCase by id
    const deleteComputerCaseResult: DeleteResult = await deleteAComputerCaseService(
      computerCaseId
    );

    if (deleteComputerCaseResult.deletedCount === 0) {
      response.status(400).json({
        message: "Computer Case could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: "Computer Case deleted", resourceData: [] });
  }
);

export {
  createNewComputerCaseBulkHandler,
  createNewComputerCaseHandler,
  deleteAComputerCaseHandler,
  deleteAllComputerCasesHandler,
  getComputerCaseByIdHandler,
  getQueriedComputerCasesHandler,
  updateComputerCaseByIdHandler,
  updateComputerCasesBulkHandler,
};
