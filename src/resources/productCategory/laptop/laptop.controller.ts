import expressAsyncController from "express-async-handler";

import type { FilterQuery, QueryOptions } from "mongoose";
import type { Response } from "express";
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

// @desc   Create new laptop
// @route  POST /api/v1/product-category/laptop
// @access Private/Admin/Manager
const createNewLaptopController = expressAsyncController(
  async (
    request: CreateNewLaptopRequest,
    response: Response<ResourceRequestServerResponse<LaptopDocument>>
  ) => {
    const { laptopSchema } = request.body;

    const laptopDocument: LaptopDocument = await createNewLaptopService(laptopSchema);

    if (!laptopDocument) {
      response.status(400).json({
        message: "Could not create new laptop",
        resourceData: [],
      });
      return;
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
    response: Response<ResourceRequestServerResponse<LaptopDocument>>
  ) => {
    const { laptopSchemas } = request.body;

    const newLaptops = await Promise.all(
      laptopSchemas.map(async (laptopSchema) => {
        const newLaptop = await createNewLaptopService(laptopSchema);
        return newLaptop;
      })
    );

    // filter out any laptops that were not created
    const successfullyCreatedLaptops = newLaptops.filter((laptop) => laptop);

    // check if any laptops were created
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
    response: Response<ResourceRequestServerResponse<LaptopDocument>>
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

    // filter out any laptops that were not updated
    const successfullyUpdatedLaptops = updatedLaptops.filter(
      removeUndefinedAndNullValues
    );

    // check if any laptops were updated
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

    // get all laptops
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
    response: Response<ResourceRequestServerResponse<LaptopDocument>>
  ) => {
    const laptopId = request.params.laptopId;

    // get laptop by id
    const laptop = await getLaptopByIdService(laptopId);
    if (!laptop) {
      response.status(404).json({ message: "Laptop not found", resourceData: [] });
      return;
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
    response: Response<ResourceRequestServerResponse<LaptopDocument>>
  ) => {
    const { laptopId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
    } = request.body;

    // update laptop
    const updatedLaptop = await updateLaptopByIdService({
      _id: laptopId,
      fields,
      updateOperator,
    });

    if (!updatedLaptop) {
      response.status(400).json({
        message: "Laptop could not be updated",
        resourceData: [],
      });
      return;
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
    response: Response<ResourceRequestServerResponse<LaptopDocument>>
  ) => {
    // grab all laptops file upload ids
    const uploadedFilesIds = await returnAllLaptopsUploadedFileIdsService();

    // delete all file uploads associated with all laptops
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

    // delete all reviews associated with all laptops
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

    // delete all laptops
    const deleteLaptopsResult: DeleteResult = await deleteAllLaptopsService();

    if (deleteLaptopsResult.deletedCount === 0) {
      response.status(400).json({
        message: "All laptops could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
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
    response: Response<ResourceRequestServerResponse<LaptopDocument>>
  ) => {
    const laptopId = request.params.laptopId;

    // check if laptop exists
    const laptopExists = await getLaptopByIdService(laptopId);
    if (!laptopExists) {
      response.status(404).json({ message: "Laptop does not exist", resourceData: [] });
      return;
    }

    // find all file uploads associated with this laptop
    // if it is not an array, it is made to be an array
    const uploadedFilesIds = [...laptopExists.uploadedFilesIds];

    // delete all file uploads associated with all laptops
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

    // delete all reviews associated with all laptops
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

    // delete laptop by id
    const deleteLaptopResult: DeleteResult = await deleteALaptopService(laptopId);

    if (deleteLaptopResult.deletedCount === 0) {
      response.status(400).json({
        message: "Laptop could not be deleted. Please try again.",
        resourceData: [],
      });
      return;
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
