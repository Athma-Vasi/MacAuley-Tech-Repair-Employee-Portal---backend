import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserPasswordRequest,
  UpdateUserRequest,
} from './user.types';

import { getNotesByUserService } from '../note';
import {
  checkUserExistsService,
  checkUserPasswordService,
  createNewUserService,
  deleteUserService,
  getAllUsersService,
  updateUserPasswordService,
  updateUserService,
} from './user.service';
import { returnEmptyFieldsTuple } from '../../utils';
import { add } from 'date-fns';

// @desc   Create new user
// @route  POST /users
// @access Private
const createNewUserHandler = expressAsyncHandler(
  async (request: CreateNewUserRequest, response: Response) => {
    const {
      email,
      username,
      password,
      firstName,
      middleName,
      lastName,
      contactNumber,
      address,
      jobPosition,
      department,
      emergencyContact,
      startDate,
      roles = ['Employee'],
      active = true,
    } = request.body;
    const { addressLine1, city, province, state, postalCode, country } = address;
    const { fullName, contactNumber: emergencyContactNumber } = emergencyContact;

    console.log(JSON.stringify(request.body, null, 2));

    // both state and province cannot be empty (both are required)
    if (!state && !province) {
      response.status(400).json({
        message: 'State or province must be filled',
      });
      return;
    }

    const isFieldsEmpty: [string, boolean][] = returnEmptyFieldsTuple({
      email,
      username,
      password,
      firstName,
      middleName,
      lastName,
      contactNumber,
      addressLine1,
      city,
      startDate,
      country,
      postalCode,
      jobPosition,
      department,
      fullName,
      emergencyContactNumber,
    });

    if (isFieldsEmpty.length > 0) {
      response.status(400).json({
        message: `${isFieldsEmpty.map(([field, _]) => field).join(', ')} are required`,
      });
      return;
    }

    // check for duplicate email
    const isDuplicateEmail = await checkUserExistsService({ email });
    if (isDuplicateEmail) {
      response.status(409).json({ message: 'Email already exists' });
      return;
    }

    // check for duplicate username
    const isDuplicateUser = await checkUserExistsService({ username });
    if (isDuplicateUser) {
      response.status(409).json({ message: 'Username already exists' });
      return;
    }

    const newUserData = {
      email,
      username,
      password,
      firstName,
      middleName,
      lastName,
      contactNumber,
      address,
      jobPosition,
      department,
      emergencyContact,
      startDate,
      roles,
      active,
    };

    // create new user if all checks pass successfully
    const createdUser = await createNewUserService(newUserData);
    if (createdUser) {
      response.status(201).json({ message: `User ${username} created successfully` });
    } else {
      response.status(400).json({ message: 'User creation failed' });
    }
  }
);

// @desc   Delete a user
// @route  DELETE /users
// @access Private
const deleteUserHandler = expressAsyncHandler(
  async (request: DeleteUserRequest, response: Response) => {
    // only managers/admin are allowed to delete users
    const {
      userInfo: { roles },
      userToBeDeletedId,
    } = request.body;

    if (roles.includes('Employee')) {
      response.status(403).json({ message: 'Unauthorized' });
      return;
    }

    if (!userToBeDeletedId) {
      response.status(400).json({ message: 'userToBeDeletedId is required' });
      return;
    }

    // we do not want to delete the user if they have notes assigned to them that are not completed
    const userHasNotes = await getNotesByUserService(userToBeDeletedId);
    if (userHasNotes.filter((note) => note.completed).length > 0) {
      response
        .status(400)
        .json({ message: 'User has notes assigned to them that are not completed' });
      return;
    }

    // check user exists
    const userExists = await checkUserExistsService({ userId: userToBeDeletedId });
    if (!userExists) {
      response.status(400).json({ message: 'User does not exist' });
      return;
    }

    // delete user if all checks pass successfully
    const deletedUser = await deleteUserService(userToBeDeletedId);
    if (deletedUser.acknowledged) {
      response.status(200).json({ message: 'User deleted successfully' });
    } else {
      response.status(400).json({ message: 'User deletion failed' });
    }
  }
);

// @desc   Get all users
// @route  GET /users
// @access Private
const getAllUsersHandler = expressAsyncHandler(
  async (request: GetAllUsersRequest, response: Response) => {
    // only managers/admin are allowed to get all users
    const {
      userInfo: { roles },
    } = request.body;

    if (roles.includes('Employee')) {
      response
        .status(403)
        .json({ message: 'Only managers and admins are allowed to get all users' });
      return;
    }

    const users = await getAllUsersService();
    if (users.length === 0) {
      response.status(404).json({ message: 'No users found' });
    } else {
      response.status(200).json({
        message: 'Users found successfully',
        userData: users,
      });
    }
  }
);

// @desc   Update a user
// @route  PATCH /users
// @access Private
const updateUserHandler = expressAsyncHandler(
  async (request: UpdateUserRequest, response: Response) => {
    const {
      userInfo: { roles, userId, username },
      email,
      firstName,
      middleName,
      lastName,
      contactNumber,
      address,
      jobPosition,
      department,
      emergencyContact,
      startDate,
      active,
    } = request.body;
    const { addressLine1, city, country, postalCode, province, state } = address;
    const { contactNumber: emergencyContactNumber, fullName } = emergencyContact;

    // both state and provinces cannot be empty (one must be filled)
    if (!state && !province) {
      response.status(400).json({
        message: 'state and province cannot both be empty',
      });
      return;
    }

    // check arrays exist
    const isArraysEmpty = [roles, department, jobPosition, country]
      .map((field) => !field || field.length === 0)
      .filter((value) => value === true);
    if (isArraysEmpty.length > 0) {
      response.status(400).json({
        message: 'roles, department, country and jobPosition are required',
      });
      return;
    }

    // all fields except password are required
    const isFieldsEmpty: [string, boolean][] = returnEmptyFieldsTuple({
      email,
      firstName,
      middleName,
      lastName,
      contactNumber,
      startDate,
      addressLine1,
      country,
      jobPosition,
      department,
      city,
      postalCode,
      emergencyContactNumber,
      fullName,
    });
    if (isFieldsEmpty.length > 0) {
      response.status(400).json({
        message: `${isFieldsEmpty.map(([field, _]) => field).join(', ')} are required`,
      });
      return;
    }

    // confirm that active is a boolean
    if (active === undefined || typeof active !== 'boolean') {
      response
        .status(400)
        .json({ message: 'Active field is required and must be of type boolean' });
      return;
    }

    // update user if all checks pass successfully
    const updatedUser = await updateUserService({
      userId,
      email,
      username,
      roles,
      active,
      firstName,
      middleName,
      lastName,
      contactNumber,
      address,
      jobPosition,
      department,
      emergencyContact,
      startDate,
    });
    if (updatedUser) {
      response.status(200).json({ message: `User ${updatedUser.username} updated successfully` });
    } else {
      response.status(400).json({ message: 'User update failed' });
    }
  }
);

// @desc   update user password
// @route  PATCH /users/password
// @access Private
const updateUserPasswordHandler = expressAsyncHandler(
  async (request: UpdateUserPasswordRequest, response: Response) => {
    const {
      userInfo: { userId },
      currentPassword,
      newPassword,
    } = request.body;

    // check if user exists
    const userExists = await checkUserExistsService({ userId });
    if (!userExists) {
      response.status(400).json({ message: 'User does not exist' });
      return;
    }

    // check if current password is correct
    const isCurrentPasswordCorrect = await checkUserPasswordService({
      userId,
      password: currentPassword,
    });
    if (!isCurrentPasswordCorrect) {
      response.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    // check if new password is the same as current password
    if (currentPassword === newPassword) {
      response.status(400).json({ message: 'New password cannot be the same as current password' });
      return;
    }

    // update user password if all checks pass successfully
    const updatedUser = await updateUserPasswordService({ userId, newPassword });
    if (updatedUser) {
      response.status(200).json({ message: 'Password updated successfully' });
    } else {
      response.status(400).json({ message: 'Password update failed' });
    }
  }
);

export {
  createNewUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
  updateUserHandler,
  updateUserPasswordHandler,
};
