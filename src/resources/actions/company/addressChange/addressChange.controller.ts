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
import { getUserByIdService } from '../../../user';
import { create } from 'domain';
import { createNewAddressChangeService } from './addressChange.service';

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
    const newUserObject: User = {
      ...userExists,
      address: newAddress,
    };
    // update user's address

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

export { createNewAddressChange };
