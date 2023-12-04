import expressAsyncHandler from "express-async-handler";
import type { DeleteResult } from "mongodb";

import type { AddressChangeDocument, AddressChangeSchema } from "./addressChange.model";
import type { Response } from "express";
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

import { getUserByIdService, updateUserByIdService } from "../../../user";
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
  GetQueriedResourceRequest,
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../../../types";
import { removeUndefinedAndNullValues } from "../../../../utils";

// @desc   Create a new address change request
// @route  POST api/v1/company/address-change
// @access Private
const createNewAddressChangeHandler = expressAsyncHandler(
  async (
    request: CreateNewAddressChangeRequest,
    response: Response<ResourceRequestServerResponse<AddressChangeDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      addressChangeFields: {
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

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: "User does not exist", resourceData: [] });
      return;
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
    // check if new address is the same as current address
    if (JSON.stringify(newAddress) === JSON.stringify(oldAddress)) {
      response.status(400).json({
        message: "New address is the same as current address",
        resourceData: [],
      });
      return;
    }

    // create new address change object
    const newAddressChange: AddressChangeSchema = {
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

    // save new address change object to database
    const createdAddressChange = await createNewAddressChangeService(newAddressChange);
    if (!createdAddressChange) {
      response.status(400).json({
        message: "New address change request creation failed",
        resourceData: [],
      });
      return;
    }

    response.status(201).json({
      message: "Address change request created successfully",
      resourceData: [createdAddressChange],
    });
  }
);

// @desc   Get all address changes
// @route  GET api/v1/company/address-change
// @access Private/Admin/Manager
const getQueriedAddressChangesHandler = expressAsyncHandler(
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

    // get all address changes
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
// @route  GET api/v1/company/address-change/user
// @access Private
const getAddressChangesByUserHandler = expressAsyncHandler(
  async (
    request: GetQueriedAddressChangesByUserRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AddressChangeDocument>>
  ) => {
    // anyone can view their own addressChange requests
    const {
      userInfo: { userId },
    } = request.body;

    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // assign userId to filter
    const filterWithUserId = { ...filter, userId };

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalAddressChangesService({
        filter: filterWithUserId,
      });
    }

    // get all addressChange requests by user
    const addressChanges = await getQueriedAddressChangesByUserService({
      filter: filterWithUserId as FilterQuery<AddressChangeDocument> | undefined,
      projection: projection as QueryOptions<AddressChangeDocument>,
      options: options as QueryOptions<AddressChangeDocument>,
    });
    if (addressChanges.length === 0) {
      response.status(200).json({
        message: "No address change requests found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: "Address change requests found successfully",
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: addressChanges,
      });
    }
  }
);

// @desc   Update address change status
// @route  PATCH api/v1/company/address-change/:addressChangeId
// @access Private/Admin/Manager
const updateAddressChangeStatusByIdHandler = expressAsyncHandler(
  async (
    request: UpdateAddressChangeByIdRequest,
    response: Response<ResourceRequestServerResponse<AddressChangeDocument>>
  ) => {
    const { addressChangeId } = request.params;
    const {
      documentUpdate: { fields, updateOperator },
      userInfo: { userId },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: "User does not exist", resourceData: [] });
      return;
    }

    // update addressChange request status
    const updatedAddressChange = await updateAddressChangeByIdService({
      _id: addressChangeId,
      fields,
      updateOperator,
    });

    if (!updatedAddressChange) {
      response.status(400).json({
        message: "Address change request status update failed. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Address change request status updated successfully",
      resourceData: [updatedAddressChange],
    });
  }
);

// @desc   Get an address change request
// @route  GET api/v1/company/address-change/:addressChangeId
// @access Private
const getAddressChangeByIdHandler = expressAsyncHandler(
  async (
    request: GetAddressChangeByIdRequest,
    response: Response<ResourceRequestServerResponse<AddressChangeDocument>>
  ) => {
    const { addressChangeId } = request.params;
    // get addressChange request by id
    const addressChange = await getAddressChangeByIdService(addressChangeId);
    if (!addressChange) {
      response
        .status(404)
        .json({ message: "AddressChange request not found", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "Address change request found successfully",
      resourceData: [addressChange],
    });
  }
);

// @desc   Delete an address change request by its id
// @route  DELETE api/v1/company/address-change/:addressChangeId
// @access Private
const deleteAnAddressChangeHandler = expressAsyncHandler(
  async (request: DeleteAnAddressChangeRequest, response: Response) => {
    const { addressChangeId } = request.params;

    // delete addressChange request by id
    const deletedResult: DeleteResult = await deleteAddressChangeByIdService(
      addressChangeId
    );

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "Address change request could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "AddressChange request deleted successfully",
      resourceData: [],
    });
  }
);

// @desc    Delete all address change requests
// @route   DELETE api/v1/company/address-change/delete-all
// @access  Private
const deleteAllAddressChangesHandler = expressAsyncHandler(
  async (_request: DeleteAllAddressChangesRequest, response: Response) => {
    const deletedResult: DeleteResult = await deleteAllAddressChangesService();

    if (!deletedResult.deletedCount) {
      response.status(400).json({
        message: "All address change requests could not be deleted",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "All address change requests deleted successfully",
      resourceData: [],
    });
  }
);

// DEV ROUTE
// @desc   Create new address change requests in bulk
// @route  POST api/v1/company/address-change/dev
// @access Private
const createNewAddressChangesBulkHandler = expressAsyncHandler(
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

    // filter out any null documents
    const filteredAddressChangeDocuments = addressChangeDocuments.filter(
      removeUndefinedAndNullValues
    );

    // check if any documents were created
    if (filteredAddressChangeDocuments.length === 0) {
      response.status(400).json({
        message: "Address change requests creation failed",
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
// @route  PATCH api/v1/company/address-change/dev
// @access Private
const updateAddressChangesBulkHandler = expressAsyncHandler(
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

    // filter out any addressChanges that were not created
    const successfullyCreatedAddressChanges = updatedAddressChanges.filter(
      removeUndefinedAndNullValues
    );

    if (successfullyCreatedAddressChanges.length === 0) {
      response.status(400).json({
        message: "Could not create any Address Changes",
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
  createNewAddressChangeHandler,
  getQueriedAddressChangesHandler,
  getAddressChangesByUserHandler,
  getAddressChangeByIdHandler,
  deleteAnAddressChangeHandler,
  deleteAllAddressChangesHandler,
  updateAddressChangeStatusByIdHandler,
  createNewAddressChangesBulkHandler,
  updateAddressChangesBulkHandler,
};
