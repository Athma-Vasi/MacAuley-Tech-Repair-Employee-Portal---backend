import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  CreateNewUserRequest,
  DeleteUserRequest,
  GetAllUsersRequest,
  GetUserByIdRequest,
  UpdateUserPasswordRequest,
  UpdateUserRequest,
} from './user.types';

import { getNotesByUserService } from '../note';
import {
  checkUserExistsService,
  checkUserPasswordService,
  createNewUserService,
  deleteUserService,
  getQueriedTotalUsersService,
  getQueriedUsersService,
  updateUserPasswordService,
  updateUserByIdService,
  getAllUsersService,
  getUserByIdService,
} from './user.service';
import { returnEmptyFieldsTuple } from '../../utils';
import { UserDocument, UserSchema } from './user.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../types';
import { FilterQuery, QueryOptions } from 'mongoose';
import { get } from 'http';

// @desc   Create new user
// @route  POST /users
// @access Private
const createNewUserHandler = expressAsyncHandler(
  async (
    request: CreateNewUserRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    const {
      email,
      username,
      password,
      firstName,
      middleName,
      lastName,
      contactNumber,
      dateOfBirth,
      preferredName,
      preferredPronouns,
      profilePictureUrl,
      address,
      jobPosition,
      department,
      storeLocation,
      emergencyContact,
      startDate,
      roles = ['Employee'],
      active = true,
    } = request.body;
    const { addressLine, city, province, state, postalCode, country } = address;
    const { fullName, contactNumber: emergencyContactNumber } = emergencyContact;

    // both state and province cannot be empty (both are required)
    if (!state && !province) {
      response.status(400).json({
        message: 'State or province must be filled',
        resourceData: [],
      });
      return;
    }

    const isFieldsEmpty: [string, boolean][] = returnEmptyFieldsTuple({
      email,
      username,
      password,
      firstName,
      lastName,
      contactNumber,
      addressLine,
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
        resourceData: [],
      });
      return;
    }

    // check for duplicate email
    const isDuplicateEmail = await checkUserExistsService({ email });
    if (isDuplicateEmail) {
      response.status(409).json({ message: 'Email already exists', resourceData: [] });
      return;
    }

    // check for duplicate username
    const isDuplicateUser = await checkUserExistsService({ username });
    if (isDuplicateUser) {
      response.status(409).json({ message: 'Username already exists', resourceData: [] });
      return;
    }

    const newUserData: UserSchema = {
      email,
      username,
      password,
      firstName,
      middleName,
      lastName,
      contactNumber,
      dateOfBirth,
      preferredName,
      preferredPronouns,
      profilePictureUrl,
      jobPosition,
      department,
      storeLocation,
      startDate,
      roles,
      active,
      address,
      emergencyContact,
      completedSurveys: [],
    };

    // create new user if all checks pass successfully
    const createdUser = await createNewUserService(newUserData);
    if (createdUser) {
      response
        .status(201)
        .json({ message: `User ${username} created successfully`, resourceData: [createdUser] });
    } else {
      response.status(400).json({ message: 'User creation failed', resourceData: [] });
    }
  }
);

// @desc   Get all users
// @route  GET /users
// @access Private
const getQueriedUsersHandler = expressAsyncHandler(
  async (
    request: GetAllUsersRequest,
    response: Response<GetQueriedResourceRequestServerResponse<UserDocument>>
  ) => {
    let { newQueryFlag, totalDocuments } = request.body;

    const { filter, projection, options } = request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalUsersService({
        filter: filter as FilterQuery<UserDocument> | undefined,
      });

      console.log('totalDocuments', totalDocuments);
    }

    // get all users
    const users = await getQueriedUsersService({
      filter: filter as FilterQuery<UserDocument> | undefined,
      projection: projection as QueryOptions<UserDocument>,
      options: options as QueryOptions<UserDocument>,
    });
    if (users.length === 0) {
      response.status(404).json({
        message: 'No users that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
    } else {
      response.status(200).json({
        message: 'Successfully found users',
        pages: Math.ceil(totalDocuments / Number(options?.limit)),
        totalDocuments,
        resourceData: users,
      });
    }

    // const users = await getAllUsersService();
    // if (users.length === 0) {
    //   response.status(404).json({
    //     message: 'No users that match query parameters were found',
    //     pages: 0,
    //     totalDocuments: 0,
    //     resourceData: [],
    //   });
    // }
    // response.status(200).json({
    //   message: 'Successfully found users',
    //   pages: 1,
    //   totalDocuments: users.length,
    //   resourceData: users,
    // });
  }
);

// @desc   Get a user by id
// @route  GET /users/:id
// @access Private
const getUserByIdHandler = expressAsyncHandler(
  async (
    request: GetUserByIdRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    const { userId } = request.params;

    const user = await getUserByIdService(userId);
    if (user) {
      response.status(200).json({ message: 'Successfully found user data!', resourceData: [user] });
    } else {
      response.status(404).json({ message: 'User not found.', resourceData: [] });
    }
  }
);

// @desc   Delete a user
// @route  DELETE /users
// @access Private
const deleteUserHandler = expressAsyncHandler(
  async (
    request: DeleteUserRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    // only managers/admin are allowed to delete users
    const { userToBeDeletedId } = request.body;

    if (!userToBeDeletedId) {
      response.status(400).json({ message: 'userToBeDeletedId is required', resourceData: [] });
      return;
    }

    // we do not want to delete the user if they have notes assigned to them that are not completed
    const userHasNotes = await getNotesByUserService(userToBeDeletedId);
    if (userHasNotes.filter((note) => note.completed).length > 0) {
      response.status(400).json({
        message: 'User has notes assigned to them that are not completed',
        resourceData: [],
      });
      return;
    }

    // delete user if all checks pass successfully
    const deletedUser = await deleteUserService(userToBeDeletedId);
    if (deletedUser.acknowledged) {
      response.status(200).json({ message: 'User deleted successfully', resourceData: [] });
    } else {
      response.status(400).json({ message: 'User deletion failed', resourceData: [] });
    }
  }
);

// @desc   Update a user
// @route  PATCH /users
// @access Private
const updateUserByIdHandler = expressAsyncHandler(
  async (
    request: UpdateUserRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    const {
      userInfo: { roles, userId, username },
      updateObj,
    } = request.body;

    // update user if all checks pass successfully
    const updatedUser = await updateUserByIdService({
      userId,
      updateObj,
    });
    if (updatedUser) {
      response.status(200).json({
        message: `User ${updatedUser.username} updated successfully`,
        resourceData: [updatedUser],
      });
    } else {
      response.status(400).json({ message: 'User update failed', resourceData: [] });
    }
  }
);

// @desc   update user password
// @route  PATCH /users/password
// @access Private
const updateUserPasswordHandler = expressAsyncHandler(
  async (
    request: UpdateUserPasswordRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    const {
      userInfo: { userId },
      currentPassword,
      newPassword,
    } = request.body;

    // check if current password is correct
    const isCurrentPasswordCorrect = await checkUserPasswordService({
      userId,
      password: currentPassword,
    });
    if (!isCurrentPasswordCorrect) {
      response.status(400).json({ message: 'Current password is incorrect', resourceData: [] });
      return;
    }

    // check if new password is the same as current password
    if (currentPassword === newPassword) {
      response
        .status(400)
        .json({ message: 'New password cannot be the same as current password', resourceData: [] });
      return;
    }

    // update user password if all checks pass successfully
    const updatedUser = await updateUserPasswordService({ userId, newPassword });
    if (updatedUser) {
      response
        .status(200)
        .json({ message: 'Password updated successfully', resourceData: [updatedUser] });
    } else {
      response.status(400).json({ message: 'Password update failed', resourceData: [] });
    }
  }
);

export {
  createNewUserHandler,
  deleteUserHandler,
  getQueriedUsersHandler,
  updateUserByIdHandler,
  updateUserPasswordHandler,
  getUserByIdHandler,
};
