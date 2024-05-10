import expressAsyncController from "express-async-handler";
import type { DeleteResult } from "mongodb";

import type { AddressChangeDocument, AddressChangeSchema } from "./addressChange.model";
import type { NextFunction, Response } from "express";
import type {
  CreateNewAddressChangeRequest,
  DeleteAnAddressChangeRequest,
  DeleteAllAddressChangesRequest,
  GetQueriedAddressChangesByUserRequest,
  GetAddressChangeByIdRequest,
  UpdateAddressChangeByIdRequest,
  CreateNewAddressChangesBulkRequest,
  UpdateAddressChangesBulkRequest,
  GetQueriedAddressChangesRequest,
} from "./addressChange.types";

import { getUserByIdService } from "../../../user";
import {
  createNewAddressChangeService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
  getAddressChangeByIdService,
  getQueriedAddressChangesByUserService,
  getQueriedTotalAddressChangesService,
  getQueriedAddressChangesService,
  updateAddressChangeByIdService,
} from "./addressChange.service";
import { FilterQuery, QueryOptions } from "mongoose";

import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import { removeUndefinedAndNullValues } from "../../../../utils";
import createHttpError from "http-errors";

// @desc   Create a new address change request
// @route  POST api/v1/actions/company/address-change
// @access Private
const createNewAddressChangeController = expressAsyncController(
  async (
    request: CreateNewAddressChangeRequest,
    response: Response<ResourceRequestServerResponse<AddressChangeDocument>>,
    next: NextFunction
  ) => {
    const {
      userInfo: { userId, username },
      addressChangeSchema: {
        contactNumber,
        addressLine,
        city,
        country,
        postalCode,
        province,
        state,
        acknowledgement,
      },
    } = request.body;

    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      return next(new createHttpError.NotFound("User does not exist"));
    }

    const { address: oldAddress } = userExists;
    const newAddress = {
      contactNumber,
      addressLine,
      city,
      country,
      postalCode,
      province,
      state,
    };
    if (JSON.stringify(newAddress) === JSON.stringify(oldAddress)) {
      return next(
        new createHttpError.BadRequest("New address is the same as current address")
      );
    }

    const addressChangeSchema: AddressChangeSchema = {
      userId,
      username,
      contactNumber,
      addressLine,
      city,
      country,
      postalCode,
      province,
      state,
      acknowledgement,
      requestStatus: "pending",
    };

    const addressChangeDocument = await createNewAddressChangeService(
      addressChangeSchema
    );
    if (!addressChangeDocument) {
      return next(
        new createHttpError.InternalServerError(
          "Address change document creation failed. Please try again!"
        )
      );
    }

    response.status(201).json({
      message: "Address change document created successfully",
      resourceData: [addressChangeDocument],
    });
  }
);

// @desc   Get all address changes
// @route  GET api/v1/actions/company/address-change
// @access Private/Admin/Manager
const getQueriedAddressChangesController = expressAsyncController(
  async (
    request: GetQueriedAddressChangesRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AddressChangeDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalAddressChangesService({
        filter: filter as FilterQuery<AddressChangeDocument> | undefined,
      });
    }

    const addressChange = await getQueriedAddressChangesService({
      filter: filter as FilterQuery<AddressChangeDocument> | undefined,
      projection: projection as QueryOptions<AddressChangeDocument>,
      options: options as QueryOptions<AddressChangeDocument>,
    });

    if (!addressChange.length) {
      response.status(200).json({
        message: "No address changes that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Address changes found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: addressChange,
    });
  }
);

// @desc   Get all address change requests by user
// @route  GET api/v1/actions/company/address-change/user
// @access Private
const getAddressChangesByUserController = expressAsyncController(
  async (
    request: GetQueriedAddressChangesByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AddressChangeDocument>>,
    next: NextFunction
  ) => {
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalAddressChangesService({
        filter: filterWithUserId,
      });
    }

    const addressChanges = await getQueriedAddressChangesByUserService({
      filter: filterWithUserId as FilterQuery<AddressChangeDocument> | undefined,
      projection: projection as QueryOptions<AddressChangeDocument>,
      options: options as QueryOptions<AddressChangeDocument>,
    });

    if (!addressChanges.length) {
      response.status(200).json({
        message: "No address change documents found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });

      return;
    }

    response.status(200).json({
      message: "Address change documents found successfully",
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: addressChanges,
    });
  }
);

// @desc   Update address change status
// @route  PATCH api/v1/actions/company/address-change/:addressChangeId
// @access Private/Admin/Manager
const updateAddressChangeByIdController = expressAsyncController(
  async (
    request: UpdateAddressChangeByIdRequest,
    response: Response<ResourceRequestServerResponse<AddressChangeDocument>>,
    next: NextFunction
  ) => {
    const { addressChangeId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    const updatedAddressChange = await updateAddressChangeByIdService({
      _id: addressChangeId,
      fields,
      updateOperator,
    });

    if (!updatedAddressChange) {
      return next(
        new createHttpError.InternalServerError(
          "Address change document status update failed. Please try again!"
        )
      );
    }

    response.status(200).json({
      message: "Address change document status updated successfully",
      resourceData: [updatedAddressChange],
    });
  }
);

// @desc   Get an address change request
// @route  GET api/v1/actions/company/address-change/:addressChangeId
// @access Private
const getAddressChangeByIdController = expressAsyncController(
  async (
    request: GetAddressChangeByIdRequest,
    response: Response<ResourceRequestServerResponse<AddressChangeDocument>>,
    next: NextFunction
  ) => {
    const { addressChangeId } = request.params;

    const addressChange = await getAddressChangeByIdService(addressChangeId);
    if (!addressChange) {
      return next(new createHttpError.NotFound("Address change document not found"));
    }

    response.status(200).json({
      message: "Address change document found successfully",
      resourceData: [addressChange],
    });
  }
);

// @desc   Delete an address change request by its id
// @route  DELETE api/v1/actions/company/address-change/:addressChangeId
// @access Private
const deleteAnAddressChangeController = expressAsyncController(
  async (
    request: DeleteAnAddressChangeRequest,
    response: Response,
    next: NextFunction
  ) => {
    const { addressChangeId } = request.params;

    const deletedResult: DeleteResult = await deleteAddressChangeByIdService(
      addressChangeId
    );

    if (!deletedResult.deletedCount) {
      return next(
        new createHttpError.InternalServerError(
          "Address change document could not be deleted"
        )
      );
    }

    response.status(200).json({
      message: "Address change document deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all address change requests
// @route   DELETE api/v1/actions/company/address-change/delete-all
// @access  Private
const deleteAllAddressChangesController = expressAsyncController(
  async (_request: DeleteAllAddressChangesRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllAddressChangesService();

    if (!deletedResult.deletedCount) {
      throw new createHttpError.InternalServerError(
        "All address change documents could not be deleted"
      );
    }

    response.status(200).json({
      message: "All address change documents deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new address change requests in bulk
// @route  POST api/v1/actions/company/address-change/dev
// @access Private
const createNewAddressChangesBulkController = expressAsyncController(
  async (
    request: CreateNewAddressChangesBulkRequest,
    response: Response<ResourceRequestServerResponse<AddressChangeDocument>>
  ) => {
    const { addressChangeSchemas } = request.body;

    const addressChangeDocuments = await Promise.all(
      addressChangeSchemas.map(async (addressChangeSchema) => {
        const addressChangeDocument = await createNewAddressChangeService(
          addressChangeSchema
        );
        return addressChangeDocument;
      })
    );

    const filteredAddressChangeDocuments = addressChangeDocuments.filter(
      removeUndefinedAndNullValues
    );

    if (filteredAddressChangeDocuments.length === 0) {
      response.status(500).json({
        message: "Address Change Requests could not be created. Please try again.",
        resourceData: [],
      });

      return;
    }

    const uncreatedDocumentsAmount =
      addressChangeSchemas.length - filteredAddressChangeDocuments.length;

    response.status(201).json({
      message: `Successfully created ${
        filteredAddressChangeDocuments.length
      } Address Change Requests.${
        uncreatedDocumentsAmount
          ? ` ${uncreatedDocumentsAmount} documents were not created.`
          : ""
      }}`,
      resourceData: filteredAddressChangeDocuments,
    });
  }
);

// DEV ROUTE
// @desc   Update AddressChanges in bulk
// @route  PATCH api/v1/actions/company/address-change/dev
// @access Private
const updateAddressChangesBulkController = expressAsyncController(
  async (
    request: UpdateAddressChangesBulkRequest,
    response: Response<ResourceRequestServerResponse<AddressChangeDocument>>
  ) => {
    const { addressChangeFields } = request.body;

    const updatedAddressChanges = await Promise.all(
      addressChangeFields.map(async (addressChangeField) => {
        const {
          documentUpdate: { fields, updateOperator },
          addressChangeId,
        } = addressChangeField;

        const updatedAddressChange = await updateAddressChangeByIdService({
          _id: addressChangeId,
          fields,
          updateOperator,
        });

        return updatedAddressChange;
      })
    );

    const successfullyCreatedAddressChanges = updatedAddressChanges.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedAddressChanges.length === 0) {
      response.status(500).json({
        message: "Address Changes could not be updated. Please try again.",
        resourceData: [],
      });

      return;
    }

    response.status(201).json({
      message: `Successfully created ${
        successfullyCreatedAddressChanges.length
      } Address Changes. ${
        addressChangeFields.length - successfullyCreatedAddressChanges.length
      } Address Changes failed to be created.`,
      resourceData: successfullyCreatedAddressChanges,
    });
  }
);

export {
  createNewAddressChangeController,
  getQueriedAddressChangesController,
  getAddressChangesByUserController,
  getAddressChangeByIdController,
  deleteAnAddressChangeController,
  deleteAllAddressChangesController,
  updateAddressChangeByIdController,
  createNewAddressChangesBulkController,
  updateAddressChangesBulkController,
};
