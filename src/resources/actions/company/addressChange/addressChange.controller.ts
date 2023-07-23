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
  AddressChangeServerResponse,
  QueriedAddressChangesServerResponse,
} from './addressChange.types';

import { checkUserExistsService, getUserByIdService, updateUserService } from '../../../user';
import {
  createNewAddressChangeService,
  deleteAddressChangeByIdService,
  deleteAllAddressChangesService,
  getAddressChangeByIdService,
  getAddressChangesByUserService,
  getQueriedTotalAddressChangesService,
  getQueriedAddressChangesService,
} from './addressChange.service';
import { FilterQuery, QueryOptions } from 'mongoose';

import { GetQueriedResourceRequest, QueryObjectParsedWithDefaults } from '../../../../types';

// @desc   Create a new address change request
// @route  POST /address-change
// @access Private
const createNewAddressChangeHandler = expressAsyncHandler(
  async (
    request: CreateNewAddressChangeRequest,
    response: Response<AddressChangeServerResponse>
  ) => {
    const {
      userInfo: { userId, username },
      acknowledgement,
      newAddress,
      requestStatus,
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(404).json({ message: 'User does not exist', addressChangeData: [] });
      return;
    }

    // user must acknowledge that new address is correct
    if (!acknowledgement) {
      response.status(400).json({ message: 'Acknowledgement is required', addressChangeData: [] });
      return;
    }

    // grab user's current address
    const { address } = userExists;

    // check if new address is the same as current address
    if (JSON.stringify(newAddress) === JSON.stringify(address)) {
      response
        .status(400)
        .json({ message: 'New address is the same as current address', addressChangeData: [] });
      return;
    }

    // create new user object with new address
    const newUserObject = {
      ...userExists,
      userId,
      address: newAddress,
    };
    // update user's address
    const updatedUser = await updateUserService(newUserObject);
    if (!updatedUser) {
      response.status(400).json({ message: 'User update failed', addressChangeData: [] });
      return;
    }

    // create new address change object
    const newAddressChange: AddressChangeSchema = {
      userId,
      username,
      action: 'company',
      category: 'address change',
      newAddress,
      acknowledgement,
      requestStatus,
    };

    // save new address change object to database
    const createdAddressChange = await createNewAddressChangeService(newAddressChange);
    if (createdAddressChange) {
      response.status(201).json({
        message: `User ${username} address was changed successfully`,
        addressChangeData: [createdAddressChange],
      });
    } else {
      response
        .status(400)
        .json({ message: 'New address change request creation failed', addressChangeData: [] });
    }
  }
);

// @desc   Get all address changes
// @route  GET /address-change
// @access Private/Admin/Manager
const getQueriedAddressChangeHandler = expressAsyncHandler(
  async (
    request: GetQueriedResourceRequest,
    response: Response<QueriedAddressChangesServerResponse>
  ) => {
    let {
      userInfo: { roles, userId, username },
      newQueryFlag,
      totalDocuments,
    } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // check if user has permission
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'User does not have permission',
        pages: 0,
        totalDocuments: 0,
        addressChangesData: [],
      });
      return;
    }

    // if its a brand new query, get total number of documents that match the query options and filter
    // a performance optimization at an acceptable cost in accuracy as the actual number of documents may change between new queries
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
        addressChangesData: [],
      });
    } else {
      response.status(200).json({
        message: 'address changes found successfully',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments: addressChange.length,
        addressChangesData: addressChange,
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
    response: Response<AddressChangeServerResponse>
  ) => {
    // anyone can view their own addressChange requests
    const {
      userInfo: { userId },
    } = request.body;

    // get all addressChange requests by user
    const addressChanges = await getAddressChangesByUserService(userId);
    if (addressChanges.length === 0) {
      response
        .status(404)
        .json({ message: 'No addressChange requests found', addressChangeData: [] });
    } else {
      response.status(200).json({
        message: 'AddressChange requests found successfully',
        addressChangeData: addressChanges,
      });
    }
  }
);

// @desc   Get an address change request
// @route  GET /address-change/:addressChangeId
// @access Private
const getAddressChangeByIdHandler = expressAsyncHandler(
  async (request: GetAddressChangeByIdRequest, response: Response<AddressChangeServerResponse>) => {
    const {
      userInfo: { roles, userId },
      addressChangeId,
    } = request.body;

    // only managers/admin can view addressChange requests not belonging to them
    if (roles.includes('Employee')) {
      response.status(403).json({
        message:
          'Only managers or admins are allowed to view an addressChange request not belonging to them',
        addressChangeData: [],
      });
      return;
    }

    // get addressChange request by id
    const addressChange = await getAddressChangeByIdService(addressChangeId);
    if (!addressChange) {
      response
        .status(404)
        .json({ message: 'AddressChange request not found', addressChangeData: [] });
    } else {
      response.status(200).json({
        message: 'AddressChange request found successfully',
        addressChangeData: [addressChange],
      });
    }
  }
);

// @desc   Delete an address change request by its id
// @route  DELETE /address-change/:addressChangeId
// @access Private
const deleteAnAddressChangeHandler = expressAsyncHandler(
  async (request: DeleteAnAddressChangeRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
    } = request.body;
    const addressChangeId = request.params.addressChangeId;

    // only managers/admin can access this route
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers or admins are allowed to delete an addressChange request',
        addressChangeData: [],
      });
      return;
    }

    // check addressChange request exists
    const addressChangeExists = await getAddressChangeByIdService(addressChangeId);
    if (!addressChangeExists) {
      response
        .status(404)
        .json({ message: 'AddressChange request does not exist', addressChangeData: [] });
      return;
    }

    // delete addressChange request by id
    const deletedResult: DeleteResult = await deleteAddressChangeByIdService(addressChangeId);
    if (deletedResult.deletedCount === 1) {
      response.status(200).json({
        message: 'AddressChange request deleted successfully',
        addressChangeData: [],
      });
    } else {
      response.status(400).json({
        message: 'AddressChange request could not be deleted',
        addressChangeData: [],
      });
    }
  }
);

// @desc    Delete all address change requests
// @route   DELETE /address-change
// @access  Private
const deleteAllAddressChangesHandler = expressAsyncHandler(
  async (request: DeleteAllAddressChangesRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // only managers/admin can access this route
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers or admins are allowed to delete all addressChange requests',
        addressChangeData: [],
      });
      return;
    }

    // delete all addressChange requests
    const deletedResult: DeleteResult = await deleteAllAddressChangesService();
    if (deletedResult.deletedCount > 0) {
      response.status(200).json({
        message: 'All addressChange requests deleted successfully',
        addressChangeData: [],
      });
    } else {
      response.status(400).json({
        message: 'All addressChange requests could not be deleted',
        addressChangeData: [],
      });
    }
  }
);

export {
  createNewAddressChangeHandler,
  getQueriedAddressChangeHandler,
  getAddressChangesByUserHandler,
  getAddressChangeByIdHandler,
  deleteAnAddressChangeHandler,
  deleteAllAddressChangesHandler,
};
