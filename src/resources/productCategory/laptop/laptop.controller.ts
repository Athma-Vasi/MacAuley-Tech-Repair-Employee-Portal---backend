import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { NextFunction, Response } from "express";
import type { DeleteResult } from "mongodb";
import type {
  CreateNewLaptopBulkRequest,
  CreateNewLaptopRequest,
  DeleteALaptopRequest,
  DeleteAllLaptopsRequest,
  GetLaptopByIdRequest,
  GetQueriedLaptopsRequest,
  UpdateLaptopByIdRequest,
  UpdateLaptopsBulkRequest,
} from "./laptop.types";
import type {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../types";
import type { LaptopDocument } from "./laptop.model";

import {
  createNewLaptopService,
  deleteALaptopService,
  deleteAllLaptopsService,
  getLaptopByIdService,
  getQueriedLaptopsService,
  getQueriedTotalLaptopsService,
  returnAllLaptopsUploadedFileIdsService,
  updateLaptopByIdService,
} from "./laptop.service";
import { deleteFileUploadByIdService } from "../../fileUpload";

import { deleteAProductReviewService } from "../../productReview";
import { removeUndefinedAndNullValues } from "../../../utils";
import createHttpError from "http-errors";

// @desc   Create new laptop
// @route  POST /api/v1/product-category/laptop
// @access Private/Admin/Manager
const createNewLaptopController = expressAsyncController(
  async (
    request: CreateNewLaptopRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>,
    next: NextFunction
  ) => {
    const { laptopSchema } = request.body;

    const laptopDocument: LaptopDocument = await createNewLaptopService(laptopSchema);
    if (!laptopDocument) {
      return next(new createHttpError.InternalServerError("Could not create new laptop"));
    }

    response.status(201).json({
      message: `Successfully created new ${laptopDocument.model} laptop`,
      resourceData: [laptopDocument],
    });
  }
);

// DEV ROUTE
// @desc   Create new laptops bulk
// @route  POST /api/v1/product-category/laptop/dev
// @access Private/Admin/Manager
const createNewLaptopBulkController = expressAsyncController(
  async (
    request: CreateNewLaptopBulkRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>,
    next: NextFunction
  ) => {
    const { laptopSchemas } = request.body;

    const newLaptops = await Promise.all(
      laptopSchemas.map(async (laptopSchema) => {
        const newLaptop = await createNewLaptopService(laptopSchema);
        return newLaptop;
      })
    );

    const successfullyCreatedLaptops = newLaptops.filter((laptop) => laptop);

    if (successfullyCreatedLaptops.length === laptopSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${successfullyCreatedLaptops.length} laptops`,
        resourceData: successfullyCreatedLaptops,
      });
      return;
    }

    if (successfullyCreatedLaptops.length === 0) {
      response.status(400).json({
        message: "Could not create any laptops",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        laptopSchemas.length - successfullyCreatedLaptops.length
      } laptops`,
      resourceData: successfullyCreatedLaptops,
    });
    return;
  }
);

// @desc   Update laptops bulk
// @route  PATCH /api/v1/product-category/laptop/dev
// @access Private/Admin/Manager
const updateLaptopsBulkController = expressAsyncController(
  async (
    request: UpdateLaptopsBulkRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>,
    next: NextFunction
  ) => {
    const { laptopFields } = request.body;

    const updatedLaptops = await Promise.all(
      laptopFields.map(async (laptopField) => {
        const {
          documentId,
          documentUpdate: { fields, updateOperator },
        } = laptopField;

        const updatedLaptop = await updateLaptopByIdService({
          _id: documentId,
          fields,
          updateOperator,
        });

        return updatedLaptop;
      })
    );

    const successfullyUpdatedLaptops = updatedLaptops.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyUpdatedLaptops.length === laptopFields.length) {
      response.status(201).json({
        message: `Successfully updated ${successfullyUpdatedLaptops.length} laptops`,
        resourceData: successfullyUpdatedLaptops,
      });
      return;
    }

    if (successfullyUpdatedLaptops.length === 0) {
      response.status(400).json({
        message: "Could not update any laptops",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: `Successfully updated ${
        laptopFields.length - successfullyUpdatedLaptops.length
      } laptops`,
      resourceData: successfullyUpdatedLaptops,
    });
    return;
  }
);

// @desc   Get all laptops
// @route  GET /api/v1/product-category/laptop
// @access Private/Admin/Manager
const getQueriedLaptopsController = expressAsyncController(
  async (
    request: GetQueriedLaptopsRequest,
    response: Response<GetQueriedResourceRequestServerResponse<LaptopDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalLaptopsService({
        filter: filter as FilterQuery<LaptopDocument> | undefined,
      });
    }

    const laptops = await getQueriedLaptopsService({
      filter: filter as FilterQuery<LaptopDocument> | undefined,
      projection: projection as QueryOptions<LaptopDocument>,
      options: options as QueryOptions<LaptopDocument>,
    });

    if (laptops.length === 0) {
      response.status(200).json({
        message: "No laptops that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully retrieved laptops",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: laptops,
    });
  }
);

// @desc   Get laptop by id
// @route  GET /api/v1/product-category/laptop/:laptopId
// @access Private/Admin/Manager
const getLaptopByIdController = expressAsyncController(
  async (
    request: GetLaptopByIdRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>,
    next: NextFunction
  ) => {
    const laptopId = request.params.laptopId;

    const laptop = await getLaptopByIdService(laptopId);
    if (!laptop) {
      return next(new createHttpError.NotFound("Laptop does not exist"));
    }

    response.status(200).json({
      message: "Successfully retrieved laptop",
      resourceData: [laptop],
    });
  }
);

// @desc   Update a laptop by id
// @route  PUT /api/v1/product-category/laptop/:laptopId
// @access Private/Admin/Manager
const updateLaptopByIdController = expressAsyncController(
  async (
    request: UpdateLaptopByIdRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>,
    next: NextFunction
  ) => {
    const { laptopId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    const updatedLaptop = await updateLaptopByIdService({
      _id: laptopId,
      fields,
      updateOperator,
    });

    if (!updatedLaptop) {
      return next(new createHttpError.InternalServerError("Could not update laptop"));
    }

    response.status(200).json({
      message: "Laptop updated successfully",
      resourceData: [updatedLaptop],
    });
  }
);

// @desc   Delete all laptops
// @route  DELETE /api/v1/product-category/laptop
// @access Private/Admin/Manager
const deleteAllLaptopsController = expressAsyncController(
  async (
    _request: DeleteAllLaptopsRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>,
    next: NextFunction
  ) => {
    const uploadedFilesIds = await returnAllLaptopsUploadedFileIdsService();

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

    const deleteLaptopsResult: DeleteResult = await deleteAllLaptopsService();
    if (deleteLaptopsResult.deletedCount === 0) {
      return next(
        new createHttpError.InternalServerError("Could not delete all laptops")
      );
    }

    response.status(200).json({ message: "All laptops deleted", resourceData: [] });
  }
);

// @desc   Delete a laptop by id
// @route  DELETE /api/v1/product-category/laptop/:laptopId
// @access Private/Admin/Manager
const deleteALaptopController = expressAsyncController(
  async (
    request: DeleteALaptopRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>,
    next: NextFunction
  ) => {
    const laptopId = request.params.laptopId;

    const laptopExists = await getLaptopByIdService(laptopId);
    if (!laptopExists) {
      return next(new createHttpError.NotFound("Laptop does not exist"));
    }

    const uploadedFilesIds = [...laptopExists.uploadedFilesIds];

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

    const deleteLaptopResult: DeleteResult = await deleteALaptopService(laptopId);
    if (deleteLaptopResult.deletedCount === 0) {
      return next(new createHttpError.InternalServerError("Could not delete laptop"));
    }

    response.status(200).json({ message: "Laptop deleted", resourceData: [] });
  }
);

export {
  createNewLaptopBulkController,
  createNewLaptopController,
  deleteALaptopController,
  deleteAllLaptopsController,
  getLaptopByIdController,
  getQueriedLaptopsController,
  updateLaptopByIdController,
  updateLaptopsBulkController,
};
