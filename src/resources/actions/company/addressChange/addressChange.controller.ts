import expressAsyncHandler from 'express-async-handler';
import { AddressChangeModel, AddressChangeSchema } from './addressChange.model';

import type { Response } from 'express';
import type {
  CreateNewAddressChangeRequest,
  DeleteAnAddressChangeRequest,
  DeleteAllAddressChangesRequest,
  GetAllAddressChangesRequest,
  GetAddressChangesByUserRequest,
  GetAnAddressChangeRequest,
  UpdateAnAddressChangeRequest,
} from './addressChange.types';
import { checkUserExistsService, getUserByIdService, updateUserService } from '../../../user';
import { create } from 'domain';
import {
  createNewAddressChangeService,
  deleteAddressChangeByIdService,
  getAddressChangeByIdService,
  getAddressChangesByUserService,
  getAllAddressChangesService,
} from './addressChange.service';
import { UserDatabaseResponse } from '../../../user/user.types';
import { Types } from 'mongoose';

// @desc   Create a new address change request
// @route  POST /address-change
// @access Private
const createNewAddressChangeHandler = expressAsyncHandler(
  async (request: CreateNewAddressChangeRequest, response: Response) => {
    const {
      userInfo: { roles, userId, username },
      newAddress,
    } = request.body;

    // check if user exists
    const userExists = await getUserByIdService(userId);
    if (!userExists) {
      response.status(400).json({ message: 'User does not exist', addressChangeData: [] });
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
      email: userExists.email,
      contactNumber: userExists.contactNumber,
      newAddress,
    };

    // save new address change object to database
    const createdAddressChange = await createNewAddressChangeService(newAddressChange);
    if (createdAddressChange) {
      response.status(201).json({
        message: 'New address change request created successfully',
        addressChangeData: [createdAddressChange],
      });
    } else {
      response
        .status(400)
        .json({ message: 'New address change request creation failed', addressChangeData: [] });
    }
  }
);

// @desc   Get all address change requests
// @route  GET /address-change
// @access Private
const getAllAddressChangesHandler = expressAsyncHandler(
  async (request: GetAllAddressChangesRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // only managers/admin can access this route
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers or admins are allowed to view all addressChange requests',
        addressChangeData: [],
      });
      return;
    }

    // check user exists
    const userExists = await checkUserExistsService({ userId });
    if (!userExists) {
      response.status(400).json({ message: 'User does not exist', addressChangeData: [] });
      return;
    }

    // get all addressChange requests
    const addressChanges = await getAllAddressChangesService();
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

// @desc   Get all address change requests by user
// @route  GET /address-change/user
// @access Private
const getAddressChangesByUserHandler = expressAsyncHandler(
  async (request: GetAddressChangesByUserRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
    } = request.body;

    // only managers/admin can access this route
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers or admins are allowed to view  addressChange requests by user',
        addressChangeData: [],
      });
      return;
    }

    // check user exists
    const userExists = await checkUserExistsService({ userId });
    if (!userExists) {
      response.status(400).json({ message: 'User does not exist', addressChangeData: [] });
      return;
    }

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
const getAnAddressChangeHandler = expressAsyncHandler(
  async (request: GetAnAddressChangeRequest, response: Response) => {
    const {
      userInfo: { roles, userId },
      addressChangeId,
    } = request.body;

    // only managers/admin can access this route
    if (roles.includes('Employee')) {
      response.status(403).json({
        message:
          'Only managers or admins are allowed to view an addressChange request not belonging to them',
        addressChangeData: [],
      });
      return;
    }

    // check user exists
    const userExists = await checkUserExistsService({ userId });
    if (!userExists) {
      response.status(400).json({ message: 'User does not exist', addressChangeData: [] });
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
    const addressChangeId = request.params.addressChangeId as Types.ObjectId;

    // only managers/admin can access this route
    if (roles.includes('Employee')) {
      response.status(403).json({
        message: 'Only managers or admins are allowed to delete an addressChange request',
        addressChangeData: [],
      });
      return;
    }

    // check user exists
    const userExists = await checkUserExistsService({ userId });
    if (!userExists) {
      response.status(400).json({ message: 'User does not exist', addressChangeData: [] });
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
    const deletedResult = await deleteAddressChangeByIdService(addressChangeId);
    if (deletedResult.acknowledged) {
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

export {
  createNewAddressChangeHandler,
  getAllAddressChangesHandler,
  getAddressChangesByUserHandler,
  getAnAddressChangeHandler,
  deleteAnAddressChangeHandler,
};
