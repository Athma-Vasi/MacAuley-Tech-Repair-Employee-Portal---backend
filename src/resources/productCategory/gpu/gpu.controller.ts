import expressAsyncHandler from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewGpuBulkRequest,
  CreateNewGpuRequest,
  DeleteAGpuRequest,
  DeleteAllGpusRequest,
  GetGpuByIdRequest,
  GetQueriedGpusRequest,
  UpdateGpuByIdRequest,
  UpdateGpusBulkRequest,
} from "./gpu.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { GpuDocument } from "./gpu.model";

import {
  createNewGpuService,
  deleteAGpuService,
  deleteAllGpusService,
  getGpuByIdService,
  getQueriedGpusService,
  getQueriedTotalGpusService,
  returnAllGpusUploadedFileIdsService,
  updateGpuByIdService,
} from "./gpu.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";

// @desc   Create new gpu
// @route  POST /api/v1/product-category/gpu
// @access Private/Admin/Manager
const createNewGpuHandler = expressAsyncHandler(
  async (
    request: CreateNewGpuRequest,
    response: Response<ResourceRequestServerResponse<GpuDocument>>
  ) => {
    const { gpuSchema } = request.body;

    const gpuDocument: GpuDocument = await createNewGpuService(gpuSchema);

    if (!gpuDocument) {
      response.status(400).json({
        message: "Could not create new gpu",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created new ${gpuDocument.model} gpu`,
      resourceData: [gpuDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new gpus bulk
// @route  POST /api/v1/product-category/gpu/dev
// @access Private/Admin/Manager
const createNewGpuBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewGpuBulkRequest,
    response: Response<ResourceRequestServerResponse<GpuDocument>>
  ) => {
    const { gpuSchemas } = request.body;

    const newGpus = await Promise.all(
      gpuSchemas.map(async (gpuSchema) => {
        const newGpu = await createNewGpuService(gpuSchema);
        return newGpu;
      })
    );

    // filter out any gpus that were not created
    const successfullyCreatedGpus = newGpus.filter((gpu) => gpu);

    // check if any gpus were created
    if (successfullyCreatedGpus.length === gpuSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedGpus.length} gpus`,
        resourceData: successfullyCreatedGpus,
      });
      return;
    }

    if (successfullyCreatedGpus.length === 0) {
      response.status(400).json({
        message: "Could not create any gpus",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        gpuSchemas.length - successfullyCreatedGpus.length
      } gpus`,
      resourceData: successfullyCreatedGpus,
    });
    return;
  }
);

// @desc   Update gpus bulk
// @route  PATCH /api/v1/product-category/gpu/dev
// @access Private/Admin/Manager
const updateGpusBulkHandler = expressAsyncHandler(
  async (
    request: UpdateGpusBulkRequest,
    response: Response<ResourceRequestServerResponse<GpuDocument>>
  ) => {
    const { gpuFields } = request.body;

    const updatedGpus = await Promise.all(
      gpuFields.map(async (gpuField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = gpuField;

        const updatedGpu = await updateGpuByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedGpu;
      })
    );

    // filter out any gpus that were not updated
    const successfullyUpdatedGpus = updatedGpus.filter(removeUndefinedAndNullValues);

    // check if any gpus were updated
    if (successfullyUpdatedGpus.length === gpuFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedGpus.length} gpus`,
        resourceData: successfullyUpdatedGpus,
      });
      return;
    }

    if (successfullyUpdatedGpus.length === 0) {
      response.status(400).json({
        message: "Could not update any gpus",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        gpuFields.length - successfullyUpdatedGpus.length
      } gpus`,
      resourceData: successfullyUpdatedGpus,
    });
    return;
  }
);

// @desc   Get all gpus
// @route  GET /api/v1/product-category/gpu
// @access Private/Admin/Manager
const getQueriedGpusHandler = expressAsyncHandler(
  async (
    request: GetQueriedGpusRequest,
    response: Response<GetQueriedResourceRequestServerResponse<GpuDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalGpusService({
        filter: filter as FilterQuery<GpuDocument> | undefined,
      });
    }

    // get all gpus
    const gpus = await getQueriedGpusService({
      filter: filter as FilterQuery<GpuDocument> | undefined,
      projection: projection as QueryOptions<GpuDocument>,
      options: options as QueryOptions<GpuDocument>,
    });
    if (gpus.length === 0) {
      response.status(200).json({
        message: "No gpus that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved gpus",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: gpus,
    });
  }
);

// @desc   Get gpu by id
// @route  GET /api/v1/product-category/gpu/:gpuId
// @access Private/Admin/Manager
const getGpuByIdHandler = expressAsyncHandler(
  async (
    request: GetGpuByIdRequest,
    response: Response<ResourceRequestServerResponse<GpuDocument>>
  ) => {
    const gpuId = request.params.gpuId;

    // get gpu by id
    const gpu = await getGpuByIdService(gpuId);
    if (!gpu) {
      response.status(404).json({ message: "Gpu not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved gpu",
      resourceData: [gpu],
    });
  }
);

// @desc   Update a gpu by id
// @route  PUT /api/v1/product-category/gpu/:gpuId
// @access Private/Admin/Manager
const updateGpuByIdHandler = expressAsyncHandler(
  async (
    request: UpdateGpuByIdRequest,
    response: Response<ResourceRequestServerResponse<GpuDocument>>
  ) => {
    const { gpuId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    // update gpu
    const updatedGpu = await updateGpuByIdService({
      _id: gpuId,
      fields,
      updateOperator,
    });

    if (!updatedGpu) {
      response.status(400).json({
        message: "Gpu could not be updated",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Gpu updated successfully",
      resourceData: [updatedGpu],
    });
  }
);

// @desc   Delete all gpus
// @route  DELETE /api/v1/product-category/gpu
// @access Private/Admin/Manager
const deleteAllGpusHandler = expressAsyncHandler(
  async (
    _request: DeleteAllGpusRequest,
    response: Response<ResourceRequestServerResponse<GpuDocument>>
  ) => {
    // grab all gpus file upload ids
    const uploadedFilesIds = await returnAllGpusUploadedFileIdsService();

    // delete all file uploads associated with all gpus
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

    // delete all reviews associated with all gpus
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

    // delete all gpus
    const deleteGpusResult: DeleteResult = await deleteAllGpusService();

    if (deleteGpusResult.deletedCount === 0) {
      response.status(400).json({
        message: "All gpus could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: "All gpus deleted", resourceData: [] });
  }
);

// @desc   Delete a gpu by id
// @route  DELETE /api/v1/product-category/gpu/:gpuId
// @access Private/Admin/Manager
const deleteAGpuHandler = expressAsyncHandler(
  async (
    request: DeleteAGpuRequest,
    response: Response<ResourceRequestServerResponse<GpuDocument>>
  ) => {
    const gpuId = request.params.gpuId;

    // check if gpu exists
    const gpuExists = await getGpuByIdService(gpuId);
    if (!gpuExists) {
      response.status(404).json({ message: "Gpu does not exist", resourceData: [] });
      return;
    }

    // find all file uploads associated with this gpu
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...gpuExists.uploadedFilesIds];

    // delete all file uploads associated with all gpus
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

    // delete all reviews associated with all gpus
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

    // delete gpu by id
    const deleteGpuResult: DeleteResult = await deleteAGpuService(gpuId);

    if (deleteGpuResult.deletedCount === 0) {
      response.status(400).json({
        message: "Gpu could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({ message: "Gpu deleted", resourceData: [] });
  }
);

export {
  createNewGpuBulkHandler,
  createNewGpuHandler,
  deleteAGpuHandler,
  deleteAllGpusHandler,
  getGpuByIdHandler,
  getQueriedGpusHandler,
  updateGpuByIdHandler,
  updateGpusBulkHandler,
};
