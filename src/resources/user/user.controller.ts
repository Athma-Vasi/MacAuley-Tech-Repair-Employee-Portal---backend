import expressAsyncHandler from 'express-async-handler';

import type { Response } from 'express';
import type {
  UpdateUserRequest,
  UpdateUserPasswordRequest,
  GetUsersDirectoryRequest,
  GetUserByIdRequest,
  GetAllUsersRequest,
  DirectoryUserDocument,
  DeleteUserRequest,
  CreateNewUserRequest,
  AddFieldToUsersBulkRequest,
} from './user.types';

import {
  addFieldToUserService,
  checkUserExistsService,
  checkUserPasswordService,
  createNewUserService,
  deleteUserService,
  getQueriedTotalUsersService,
  getQueriedUsersService,
  getUserByIdService,
  getUsersDirectoryService,
  updateUserByIdService,
  updateUserPasswordService,
} from './user.service';
import { UserDocument, UserSchema } from './user.model';
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from '../../types';
import { FilterQuery, QueryOptions } from 'mongoose';

// @desc   Create new user
// @route  POST /user
// @access Private
const createNewUserHandler = expressAsyncHandler(
  async (
    request: CreateNewUserRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    const {
      user: {
        active = true,
        address,
        completedSurveys,
        contactNumber,
        dateOfBirth,
        department,
        email,
        emergencyContact,
        firstName,
        isPrefersReducedMotion,
        jobPosition,
        lastName,
        middleName,
        password,
        preferredName,
        preferredPronouns,
        profilePictureUrl,
        roles = ['Employee'],
        startDate,
        storeLocation,
        username,
      },
    } = request.body;
    const { province, state } = address;

    // both state and province cannot be undefined (one is required)
    if (!state && !province) {
      response.status(400).json({
        message: 'State or province is required',
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
      active,
      address,
      completedSurveys,
      contactNumber,
      dateOfBirth,
      department,
      email,
      emergencyContact,
      firstName,
      isPrefersReducedMotion,
      jobPosition,
      lastName,
      middleName,
      password,
      preferredName,
      preferredPronouns,
      profilePictureUrl,
      roles,
      startDate,
      storeLocation,
      username,
    };

    // create new user if all checks pass successfully
    const createdUser = await createNewUserService(newUserData);
    if (!createdUser) {
      response.status(400).json({ message: 'User creation failed', resourceData: [] });
      return;
    }

    response
      .status(201)
      .json({ message: `User ${username} created successfully`, resourceData: [createdUser] });
  }
);

// DEV ROUTE
// @desc   Add field to all users
// @route  PATCH /user/dev/add-field
// @access Private
const addFieldToUsersBulkHandler = expressAsyncHandler(
  async (
    request: AddFieldToUsersBulkRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    const { users } = request.body;

    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        const { field, userId, value } = user;
        const updatedUser = await addFieldToUserService({
          field,
          userId,
          value,
        });

        return updatedUser;
      })
    );

    // filter out undefined values
    const updatedUsersFiltered = updatedUsers.filter(
      (user) => user !== undefined
    ) as UserDocument[];

    // check if any users were updated
    if (updatedUsersFiltered.length === users.length) {
      response.status(201).json({
        message: `Successfully updated ${updatedUsersFiltered.length} users`,
        resourceData: updatedUsersFiltered,
      });
    } else {
      response.status(400).json({
        message: `Successfully updated ${updatedUsersFiltered.length} users, but failed to update ${
          users.length - updatedUsersFiltered.length
        } users`,
        resourceData: updatedUsersFiltered,
      });
    }
  }
);

// @desc   Get users directory
// @route  GET /user/directory
// @access Private
const getUsersDirectoryHandler = expressAsyncHandler(
  async (
    _request: GetUsersDirectoryRequest,
    response: Response<ResourceRequestServerResponse<DirectoryUserDocument>>
  ) => {
    // fetch all users
    const users = await getUsersDirectoryService();
    if (!users.length) {
      response.status(200).json({
        message: 'No users were found',
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found users',
      resourceData: users,
    });
  }
);

// @desc   Get all users
// @route  GET /user
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
    if (!users.length) {
      response.status(200).json({
        message: 'No users that match query parameters were found',
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: 'Successfully found users',
      pages: Math.ceil(totalDocuments / Number(options?.limit)),
      totalDocuments,
      resourceData: users,
    });
  }
);

// @desc   Get a user by id
// @route  GET /user/:id
// @access Private
const getUserByIdHandler = expressAsyncHandler(
  async (
    request: GetUserByIdRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    const { userId } = request.params;

    const user = await getUserByIdService(userId);

    if (!user) {
      response.status(404).json({ message: 'User not found.', resourceData: [] });
      return;
    }

    response.status(200).json({ message: 'Successfully found user data!', resourceData: [user] });
  }
);

// @desc   Delete a user
// @route  DELETE /user
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

    // delete user if all checks pass successfully
    const deletedUser = await deleteUserService(userToBeDeletedId);

    if (!deletedUser.acknowledged) {
      response
        .status(400)
        .json({ message: 'Failed to delete user. Please try again!', resourceData: [] });
      return;
    }

    response.status(200).json({ message: 'Successfully deleted user!', resourceData: [] });
  }
);

// @desc   Update a user
// @route  PATCH /user
// @access Private
const updateUserByIdHandler = expressAsyncHandler(
  async (
    request: UpdateUserRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    const {
      userInfo: { userId },
      userFields,
    } = request.body;

    // update user if all checks pass successfully
    const updatedUser = await updateUserByIdService({
      userId,
      userFields,
    });

    if (!updatedUser) {
      response.status(400).json({ message: 'User update failed', resourceData: [] });
      return;
    }

    response.status(200).json({
      message: `User ${updatedUser.username} updated successfully`,
      resourceData: [updatedUser],
    });
  }
);

// @desc   update user password
// @route  PATCH /user/password
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

    if (!updatedUser) {
      response.status(400).json({ message: 'Password update failed', resourceData: [] });
      return;
    }

    response
      .status(200)
      .json({ message: 'Password updated successfully', resourceData: [updatedUser] });
  }
);

export {
  addFieldToUsersBulkHandler,
  createNewUserHandler,
  deleteUserHandler,
  getQueriedUsersHandler,
  getUserByIdHandler,
  getUsersDirectoryHandler,
  updateUserByIdHandler,
  updateUserPasswordHandler,
};
