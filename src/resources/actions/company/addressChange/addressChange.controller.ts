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
  UpdateAddressChangeRequest,
} from './addressChange.types';
import { checkUserExistsService, getUserByIdService, updateUserService } from '../../../user';
import { create } from 'domain';
import {
  createNewAddressChangeService,
  getAddressChangesByUserService,
  getAllAddressChangesService,
} from './addressChange.service';
import { UserDatabaseResponse } from '../../../user/user.types';

// @desc   Create a new address change request
// @route  POST /address-change
// @access Private
const createNewAddressChange = expressAsyncHandler(
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
const getAllAddressChanges = expressAsyncHandler(
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
const getAddressChangesByUser = expressAsyncHandler(
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

export { createNewAddressChange, getAllAddressChanges };
