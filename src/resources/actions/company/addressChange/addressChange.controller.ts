import expressAsyncHandler from 'express-async-handler';
import type { DeleteResult } from 'mongodb';

import type { AddressChangeDocument, AddressChangeSchema } from './addressChange.model';
import type { Response } from 'express';
import type {
  CreateNewAddressChangeRequest,
  DeleteAnAddressChangeRequest,
  DeleteAllAddressChangesRequest,
  GetQueriedAddressChangesByUserRequest,
  GetAddressChangeByIdRequest,
  UpdateAddressChangeStatusByIdRequest,
} from './addressChange.types';

import { getUserByIdService, updateUserByIdService } from '../../../user';
import {
  createNewAddressChangeService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
  getAddressChangeByIdService,
  getQueriedAddressChangesByUserService,
  getQueriedTotalAddressChangesService,
  getQueriedAddressChangesService,
  updateAddressChangeStatusByIdService,
} from './addressChange.service';
import { FilterQuery, QueryOptions } from 'mongoose';

import {
  GetQueriedResourceRequest,
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../../../types';

// @desc   Create a new address change request
// @route  POST /address-change
// @access Private
const createNewAddressChangeHandler = expressAsyncHandler(
  async (
    request: CreateNewAddressChangeRequest,
    response: Response<ResourceRequestServerResponse<AddressChangeDocument>>
  ) => {
    const {
      userInfo: { userId, username },
      addressChange: { acknowledgement, addressLine, city, country, postalCode, province, state },
    } = request.body;

    // user must acknowledge that new address is correct
    if (!acknowledgement) {
      response.status(400).json({ message: 'Acknowledgement is required', resourceData: [] });
      return;
    }

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', resourceData: [] });
      return;
    }

    const { address: oldAddress } = userExists;
    const newAddress = {
      addressLine,
      city,
      country,
      postalCode,
      province,
      state,
    };
    // check if new address is the same as current address
    if (JSON.stringify(newAddress) === JSON.stringify(oldAddress)) {
      response
        .status(400)
        .json({ message: 'New address is the same as current address', resourceData: [] });
      return;
    }

    // create new address change object
    const newAddressChange: AddressChangeSchema = {
      userId,
      username,
      action: 'company',
      category: 'address change',
      addressLine,
      city,
      country,
      postalCode,
      province,
      state,
      acknowledgement,
      requestStatus: 'pending',
    };

    // save new address change object to database
    const createdAddressChange = await createNewAddressChangeService(newAddressChange);
    if (!createdAddressChange) {
      response
        .status(400)
        .json({ message: 'New address change request creation failed', resourceData: [] });
      return;
    }

    response.status(201).json({
      message: 'Address change request created successfully',
      resourceData: [createdAddressChange],
    });
  }
);

// @desc   Get all address changes
// @route  GET /address-change
// @access Private/Admin/Manager
const getQueriedAddressChangesHandler = expressAsyncHandler(
  async (
    request: GetQueriedResourceRequest,
    response: Response<GetQueriedResourceRequestServerResponse<AddressChangeDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

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
    if (addressChange.length === 0) {
      response.status(404).json({
        message: 'No address changes that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Address changes found successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: addressChange,
      });
    }
  }
);

// @desc   Get all address change requests by user
// @route  GET /address-change/user
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

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

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
      response.status(404).json({
        message: 'No address change requests found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Address change requests found successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: addressChanges,
      });
    }
  }
);

// @desc   Update address change status
// @route  PATCH /address-change/:addressChangeId
// @access Private/Admin/Manager
const updateAddressChangeStatusByIdHandler = expressAsyncHandler(
  async (
    request: UpdateAddressChangeStatusByIdRequest,
    response: Response<ResourceRequestServerResponse<AddressChangeDocument>>
  ) => {
    const { addressChangeId } = request.params;
    const {
      addressChange: { requestStatus },
      userInfo: { userId },
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', resourceData: [] });
      return;
    }

    // check if addressChange request exists
    const addressChangeExists = await getAddressChangeByIdService(addressChangeId);
    if (!addressChangeExists) {
      response.status(404).json({ message: 'Address change does not exist', resourceData: [] });
      return;
    }

    // grab the new address from addressChange request
    const { addressLine, city, province, postalCode, state, country } = addressChangeExists;
    const newAddress = { addressLine, city, province, postalCode, state, country };

    // create new user object with new address
    const newUserObject = {
      ...userExists,
      userId,
      address: newAddress,
    };
    // update user's address
    const updatedUser = await updateUserByIdService({
      userId,
      userFields: newUserObject,
    });
    if (!updatedUser) {
      response.status(400).json({ message: 'User update failed', resourceData: [] });
      return;
    }

    // update addressChange request status
    const updatedAddressChange = await updateAddressChangeStatusByIdService({
      addressChangeId,
      requestStatus,
    });
    if (!updatedAddressChange) {
      response.status(400).json({
        message: 'Address change request status update failed. Please try again!',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Address change request status updated successfully',
      resourceData: [updatedAddressChange],
    });
  }
);

// @desc   Get an address change request
// @route  GET /address-change/:addressChangeId
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
      response.status(404).json({ message: 'AddressChange request not found', resourceData: [] });
    } else {
      response.status(200).json({
        message: 'Address change request found successfully',
        resourceData: [addressChange],
      });
    }
  }
);

// @desc   Delete an address change request by its id
// @route  DELETE /address-change/:addressChangeId
// @access Private
const deleteAnAddressChangeHandler = expressAsyncHandler(
  async (request: DeleteAnAddressChangeRequest, response: Response) => {
    const addressChangeId = request.params.addressChangeId;

    // check addressChange request exists
    const addressChangeExists = await getAddressChangeByIdService(addressChangeId);
    if (!addressChangeExists) {
      response
        .status(404)
        .json({ message: 'Address change request does not exist', resourceData: [] });
      return;
    }

    // delete addressChange request by id
    const deletedResult: DeleteResult = await deleteAddressChangeByIdService(addressChangeId);
    if (deletedResult.deletedCount === 1) {
      response.status(200).json({
        message: 'AddressChange request deleted successfully',
        resourceData: [],
      });
    } else {
      response.status(400).json({
        message: 'Address change request could not be deleted',
        resourceData: [],
      });
    }
  }
);

// @desc    Delete all address change requests
// @route   DELETE /address-change
// @access  Private
const deleteAllAddressChangesHandler = expressAsyncHandler(
  async (_request: DeleteAllAddressChangesRequest, response: Response) => {
    // delete all addressChange requests
    const deletedResult: DeleteResult = await deleteAllAddressChangesService();
    if (deletedResult.deletedCount > 0) {
      response.status(200).json({
        message: 'All address change requests deleted successfully',
        resourceData: [],
      });
    } else {
      response.status(400).json({
        message: 'All address change requests could not be deleted',
        resourceData: [],
      });
    }
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
};
