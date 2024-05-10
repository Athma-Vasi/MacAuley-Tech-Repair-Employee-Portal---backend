import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewCpuBulkRequest,
  CreateNewCpuRequest,
  DeleteACpuRequest,
  DeleteAllCpusRequest,
  GetCpuByIdRequest,
  GetQueriedCpusRequest,
  UpdateCpuByIdRequest,
  UpdateCpusBulkRequest,
} from "./cpu.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { CpuDocument } from "./cpu.model";

import {
  createNewCpuService,
  deleteACpuService,
  deleteAllCpusService,
  getCpuByIdService,
  getQueriedCpusService,
  getQueriedTotalCpusService,
  returnAllCpusUploadedFileIdsService,
  updateCpuByIdService,
} from "./cpu.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new cpu
// @route  POST /api/v1/product-category/cpu
// @access Private/Admin/Manager
const createNewCpuController = expressAsyncController(
  async (
    request: CreateNewCpuRequest,
    response: Response<ResourceRequestServerResponse<CpuDocument>>,
    next: NextFunction
  ) => {
    const { cpuSchema } = request.body;

    const cpuDocument: CpuDocument = await createNewCpuService(cpuSchema);
    if (!cpuDocument) {
      return next(new createHttpError.InternalServerError("Cpu could not be created"));
    }

    response.status(201).json({
      message: `Successfully created new ${cpuDocument.model} cpu`,
      resourceData: [cpuDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new cpus bulk
// @route  POST /api/v1/product-category/cpu/dev
// @access Private/Admin/Manager
const createNewCpuBulkController = expressAsyncController(
  async (
    request: CreateNewCpuBulkRequest,
    response: Response<ResourceRequestServerResponse<CpuDocument>>,
    next: NextFunction
  ) => {
    const { cpuSchemas } = request.body;

    const newCpus = await Promise.all(
      cpuSchemas.map(async (cpuSchema) => {
        const newCpu = await createNewCpuService(cpuSchema);
        return newCpu;
      })
    );

    const successfullyCreatedCpus = newCpus.filter((cpu) => cpu);

    if (successfullyCreatedCpus.length === cpuSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedCpus.length} cpus`,
        resourceData: successfullyCreatedCpus,
      });
      return;
    }

    if (successfullyCreatedCpus.length === 0) {
      response.status(400).json({
        message: "Could not create any cpus",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        cpuSchemas.length - successfullyCreatedCpus.length
      } cpus`,
      resourceData: successfullyCreatedCpus,
    });
    return;
  }
);

// @desc   Update cpus bulk
// @route  PATCH /api/v1/product-category/cpu/dev
// @access Private/Admin/Manager
const updateCpusBulkController = expressAsyncController(
  async (
    request: UpdateCpusBulkRequest,
    response: Response<ResourceRequestServerResponse<CpuDocument>>,
    next: NextFunction
  ) => {
    const { cpuFields } = request.body;

    const updatedCpus = await Promise.all(
      cpuFields.map(async (cpuField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = cpuField;

        const updatedCpu = await updateCpuByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedCpu;
      })
    );

    const successfullyUpdatedCpus = updatedCpus.filter(removeUndefinedAndNullValues);

    if (successfullyUpdatedCpus.length === cpuFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedCpus.length} cpus`,
        resourceData: successfullyUpdatedCpus,
      });
      return;
    }

    if (successfullyUpdatedCpus.length === 0) {
      response.status(400).json({
        message: "Could not update any cpus",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        cpuFields.length - successfullyUpdatedCpus.length
      } cpus`,
      resourceData: successfullyUpdatedCpus,
    });
    return;
  }
);

// @desc   Get all cpus
// @route  GET /api/v1/product-category/cpu
// @access Private/Admin/Manager
const getQueriedCpusController = expressAsyncController(
  async (
    request: GetQueriedCpusRequest,
    response: Response<GetQueriedResourceRequestServerResponse<CpuDocument>>,
    next: NextFunction
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalCpusService({
        filter: filter as FilterQuery<CpuDocument> | undefined,
      });
    }

    const cpus = await getQueriedCpusService({
      filter: filter as FilterQuery<CpuDocument> | undefined,
      projection: projection as QueryOptions<CpuDocument>,
      options: options as QueryOptions<CpuDocument>,
    });

    if (cpus.length === 0) {
      response.status(200).json({
        message: "No cpus that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved cpus",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: cpus,
    });
  }
);

// @desc   Get cpu by id
// @route  GET /api/v1/product-category/cpu/:cpuId
// @access Private/Admin/Manager
const getCpuByIdController = expressAsyncController(
  async (
    request: GetCpuByIdRequest,
    response: Response<ResourceRequestServerResponse<CpuDocument>>,
    next: NextFunction
  ) => {
    const cpuId = request.params.cpuId;

    const cpu = await getCpuByIdService(cpuId);
    if (!cpu) {
      return next(new createHttpError.NotFound("Cpu does not exist"));
    }

    response.status(200).json({
      message: "Successfully retrieved cpu",
      resourceData: [cpu],
    });
  }
);

// @desc   Update a cpu by id
// @route  PUT /api/v1/product-category/cpu/:cpuId
// @access Private/Admin/Manager
const updateCpuByIdController = expressAsyncController(
  async (
    request: UpdateCpuByIdRequest,
    response: Response<ResourceRequestServerResponse<CpuDocument>>,
    next: NextFunction
  ) => {
    const { cpuId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedCpu = await updateCpuByIdService({
      _id: cpuId,
      fields,
      updateOperator,
    });

    if (!updatedCpu) {
      return next(new createHttpError.InternalServerError("Cpu could not be updated"));
    }

    response.status(200).json({
      message: "Cpu updated successfully",
      resourceData: [updatedCpu],
    });
  }
);

// @desc   Delete all cpus
// @route  DELETE /api/v1/product-category/cpu
// @access Private/Admin/Manager
const deleteAllCpusController = expressAsyncController(
  async (
    _request: DeleteAllCpusRequest,
    response: Response<ResourceRequestServerResponse<CpuDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllCpusUploadedFileIdsService();

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

    const deleteCpusResult: DeleteResult = await deleteAllCpusService();

    if (deleteCpusResult.deletedCount === 0) {
      return next(new createHttpError.InternalServerError("Cpus could not be deleted"));
    }

    response.status(200).json({ message: "All cpus deleted", resourceData: [] });
  }
);

// @desc   Delete a cpu by id
// @route  DELETE /api/v1/product-category/cpu/:cpuId
// @access Private/Admin/Manager
const deleteACpuController = expressAsyncController(
  async (
    request: DeleteACpuRequest,
    response: Response<ResourceRequestServerResponse<CpuDocument>>,
    next: NextFunction
  ) => {
    const cpuId = request.params.cpuId;

    const cpuExists = await getCpuByIdService(cpuId);
    if (!cpuExists) {
      response.status(404).json({ message: "Cpu does not exist", resourceData: [] });
      return;
    }

    const uploadedFilesIds = [...cpuExists.uploadedFilesIds];

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

    const deleteCpuResult: DeleteResult = await deleteACpuService(cpuId);

    if (deleteCpuResult.deletedCount === 0) {
      return next(new createHttpError.InternalServerError("Cpu could not be deleted"));
    }

    response.status(200).json({ message: "Cpu deleted", resourceData: [] });
  }
);

export {
  createNewCpuBulkController,
  createNewCpuController,
  deleteACpuController,
  deleteAllCpusController,
  getCpuByIdController,
  getQueriedCpusController,
  updateCpuByIdController,
  updateCpusBulkController,
};
