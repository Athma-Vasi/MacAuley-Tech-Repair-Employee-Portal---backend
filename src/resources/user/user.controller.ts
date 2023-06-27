import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserRequest,
} from './user.types';

import { getNotesByUserService } from '../note';
import {
  checkUserExistsService,
  createNewUserService,
  deleteUserService,
  getAllUsersService,
  updateUserService,
} from './user.service';
import { returnEmptyFieldsTuple } from '../../utils';

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

    // confirm that all required fields are present
    let fieldValuesTuples: [string, boolean][] = Object.entries({
      email,
      username,
      password,
      firstName,
      lastName,
      contactNumber,
      jobPosition,
      department,
      startDate,
    }).map(([field, value]) => [field, value === '']);
    let isFieldsEmpty: [string, boolean][] = fieldValuesTuples.filter(
      ([_, value]) => value === true
    );
    if (isFieldsEmpty.length > 0) {
      response.status(400).json({
        message: `${isFieldsEmpty.map(([field, _]) => field).join(', ')} are required`,
      });
      return;
    }

    fieldValuesTuples = Object.entries(address).map(([field, value]) => [field, value === '']);
    isFieldsEmpty = fieldValuesTuples.filter(([_, value]) => value === true);
    if (isFieldsEmpty.length > 0) {
      response.status(400).json({
        message: `${isFieldsEmpty.map(([field, _]) => field).join(', ')} are required`,
      });
      return;
    }

    fieldValuesTuples = Object.entries(emergencyContact).map(([field, value]) => [
      field,
      value === '',
    ]);
    isFieldsEmpty = fieldValuesTuples.filter(([_, value]) => value === true);
    if (isFieldsEmpty.length > 0) {
      response.status(400).json({
        message: `${isFieldsEmpty.map(([field, _]) => field).join(', ')} are required`,
      });
      return;
    }

    // confirm that roles is an array and is not empty
    if (!Array.isArray(roles) || roles.length === 0) {
      response.status(400).json({
        message: "Roles is required and must be of type: ('Admin' | 'Employee' | 'Manager')[]",
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
    } = request.body;

    if (roles.includes('Employee')) {
      response.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const { userId } = request.params;
    if (!userId) {
      response.status(400).json({ message: 'userId is required' });
      return;
    }

    // we do not want to delete the user if they have notes assigned to them that are not completed
    const userHasNotes = await getNotesByUserService(userId);
    if (userHasNotes.filter((note) => note.completed).length > 0) {
      response
        .status(400)
        .json({ message: 'User has notes assigned to them that are not completed' });
      return;
    }

    // check user exists
    const userExists = await checkUserExistsService({ userId });
    if (!userExists) {
      response.status(400).json({ message: 'User does not exist' });
      return;
    }

    // delete user if all checks pass successfully
    const deletedUser = await deleteUserService(userId);
    if (deletedUser) {
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
        users,
      });
    }
  }
);

// @desc   Update a user
// @route  PUT /users
// @access Private
const updateUserHandler = expressAsyncHandler(
  async (request: UpdateUserRequest, response: Response) => {
    const {
      userInfo: { roles, userId, username },
      email,
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
      active,
    } = request.body;

    // confirm that roles is an array and is not empty
    if (!Array.isArray(roles) || roles.length === 0) {
      response.status(400).json({
        message: "Roles is required and must be of type: ('Admin' | 'Employee' | 'Manager')[]",
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
    const updatedUser = await updateUserService({ id, email, username, password, roles, active });
    if (updatedUser) {
      response.status(200).json({ message: `User ${updatedUser.username} updated successfully` });
    } else {
      response.status(400).json({ message: 'User update failed' });
    }
  }
);

export { createNewUserHandler, deleteUserHandler, getAllUsersHandler, updateUserHandler };
