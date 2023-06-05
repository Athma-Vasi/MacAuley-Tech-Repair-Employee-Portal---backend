import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import { checkDuplicateUserService, createNewUserService, getAllUsersService } from '../services';
import { CreateNewUserRequest, GetAllUsersRequest } from '../types';

// @desc Create new user
// @route POST /users
// @access Private
const createNewUserHandler = expressAsyncHandler(
  async (request: CreateNewUserRequest, response: Response) => {
    const { username, password, roles } = request.body;

    // confirm that username and password are not empty
    if (!username || !password) {
      response.status(400).json({ message: 'Username and password are required' });
    }

    // confirm that roles is an array and is not empty
    if (!Array.isArray(roles) || roles.length === 0) {
      response.status(400).json({
        message: "Roles is required and must be of type: ('Admin' | 'Employee' | 'Manager')[]",
      });
    }

    // check for duplicate username
    const isDuplicateUser = await checkDuplicateUserService(username);
    if (isDuplicateUser) {
      response.status(400).json({ message: 'Username already exists' });
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
const deleteUserHandler = expressAsyncHandler(async (request: Request, response: Response) => {});

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
const updateUserHandler = expressAsyncHandler(async (request: Request, response: Response) => {});

export { createNewUserHandler, deleteUserHandler, getAllUsersHandler, updateUserHandler };
