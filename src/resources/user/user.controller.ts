import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  UpdateUserRequest,
} from './index';

import { getNotesByUserService } from '../note';
import {
  checkUserExistsService,
  createNewUserService,
  deleteUserService,
  getAllUsersService,
  updateUserService,
} from './index';

// @desc   Create new user
// @route  POST /users
// @access Private
const createNewUserHandler = expressAsyncHandler(
  async (request: CreateNewUserRequest, response: Response) => {
    console.log('request.body', request.body);
    const { email, username, password, roles = ['Employee'] } = request.body;

    // confirm that username and password are not empty
    if (!email || !username || !password) {
      response.status(400).json({ message: 'Email, username and password are required' });
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

    // create new user if all checks pass successfully
    const createdUser = await createNewUserService({ email, username, password, roles });
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
    const { id } = request.body;
    if (!id) {
      response.status(400).json({ message: 'User Id is required' });
      return;
    }

    // we do not want to delete the user if they have notes assigned to them that are not completed
    const userHasNotes = await getNotesByUserService(id);
    if (userHasNotes.filter((note) => note.completed).length > 0) {
      response
        .status(400)
        .json({ message: 'User has notes assigned to them that are not completed' });
      return;
    }

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

// @desc   Get all users
// @route  GET /users
// @access Private
// responseType: {message:string, users: User[]} | {message:string}
const getAllUsersHandler = expressAsyncHandler(
  async (request: GetAllUsersRequest, response: Response) => {
    const users = await getAllUsersService();
    if (users.length === 0) {
      response.status(400).json({ message: 'No users found' });
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
    const { id, email, username, password, roles, active } = request.body;

    // confirm that id and username are not empty
    if (!id || !email || !username) {
      response.status(400).json({ message: 'Id, email and username fields are required' });
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
