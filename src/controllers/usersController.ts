import expressAsyncHandler from 'express-async-handler';
import { Response } from 'express';

import {
  checkUserExistsService,
  createNewUserService,
  deleteUserService,
  getAllUsersService,
  updateUserService,
} from '../services';
import {
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserRequest,
} from '../types';

// @desc Create new user
// @route POST /users
// @access Private
const createNewUserHandler = expressAsyncHandler(
  async (request: CreateNewUserRequest, response: Response) => {
    const { username, password, roles } = request.body;

    // confirm that username and password are not empty
    if (!username || !password) {
      response.status(400).json({ message: 'Username and password are required' });
      return;
    }

    // confirm that roles is an array and is not empty
    if (!Array.isArray(roles) || roles.length === 0) {
      response.status(400).json({
        message: "Roles is required and must be of type: ('Admin' | 'Employee' | 'Manager')[]",
      });
      return;
    }

    // check for duplicate username
    const isDuplicateUser = await checkUserExistsService({ username });
    if (isDuplicateUser) {
      response.status(400).json({ message: 'Username already exists' });
      return;
    }

    // create new user if all checks pass successfully
    const createdUser = await createNewUserService({ username, password, roles });
    if (createdUser) {
      response.status(201).json({ message: `User ${username} created successfully` });
    } else {
      response.status(400).json({ message: 'User creation failed' });
    }
  }
);

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUserHandler = expressAsyncHandler(
  async (request: DeleteUserRequest, response: Response) => {
    const { id } = request.body;
    if (!id) {
      response.status(400).json({ message: 'User Id is required' });
      return;
    }

    // we do not want to delete the user if they have notes assigned to them
    // so we check the notes model for any notes with the user id
    // if there are notes with the user id, we do not delete the user
    // TODO TODO TODO TODO :: implement this check

    // check user exists
    const userExists = await checkUserExistsService({ id });
    if (!userExists) {
      response.status(400).json({ message: 'User does not exist' });
      return;
    }

    // delete user if all checks pass successfully
    const deletedUser = await deleteUserService(id);
    if (deletedUser) {
      response.status(200).json({ message: 'User deleted successfully' });
    } else {
      response.status(400).json({ message: 'User deletion failed' });
    }
  }
);

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsersHandler = expressAsyncHandler(
  async (request: GetAllUsersRequest, response: Response) => {
    const users = await getAllUsersService();
    if (users.length === 0) {
      response.status(400).json({ message: 'No users found' });
    } else {
      response.status(200).json(users);
    }
  }
);

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUserHandler = expressAsyncHandler(
  async (request: UpdateUserRequest, response: Response) => {
    const { id, username, password, roles, active } = request.body;

    // confirm that id and username are not empty
    if (!id || !username) {
      response.status(400).json({ message: 'Id and Username fields are required' });
      return;
    }

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

    // check user exists and that the username being updated is not being used by another user
    const userExists = await checkUserExistsService({ username });
    if (userExists) {
      response.status(400).json({ message: 'Username already exists' });
      return;
    }

    // update user if all checks pass successfully
    const updatedUser = await updateUserService({ id, username, password, roles, active });
    if (updatedUser) {
      response.status(200).json({ message: `User ${updatedUser.username} updated successfully` });
    } else {
      response.status(400).json({ message: 'User update failed' });
    }
  }
);

export { createNewUserHandler, deleteUserHandler, getAllUsersHandler, updateUserHandler };
