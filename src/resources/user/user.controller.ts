import expressAsyncHandler from "express-async-handler";

import type { Response } from "express";
import type {
  CreateNewUserRequest,
  CreateNewUsersBulkRequest,
  DeleteAllUsersRequest,
  DeleteUserRequest,
  GetAllUsersBulkRequest,
  GetAllUsersRequest,
  GetUserByIdRequest,
  GetUsersDirectoryRequest,
  UpdateUserFieldsBulkRequest,
  UpdateUserPasswordRequest,
  UpdateUserRequest,
} from "./user.types";

import {
  checkUserPasswordService,
  createNewUserService,
  deleteAllUsersService,
  deleteUserService,
  getAllUsersService,
  getQueriedTotalUsersService,
  getQueriedUsersService,
  getUserByIdService,
  getUserByUsernameService,
  getUserWithPasswordService,
  getUsersDirectoryService,
  updateUserByIdService,
  updateUserPasswordService,
} from "./user.service";
import { DirectoryUserDocument, UserDocument } from "./user.model";
import {
  GetQueriedResourceRequestServerResponse,
  QueryObjectParsedWithDefaults,
  ResourceRequestServerResponse,
} from "../../types";
import { FilterQuery, QueryOptions } from "mongoose";
import { removeUndefinedAndNullValues } from "../../utils";
import {
  checkEmailExistsService,
  checkUsernameExistsService,
  updateUsernameEmailSetWithEmailService,
  updateUsernameEmailSetWithUsernameService,
} from "../usernameEmailSet";

// @desc   Create new user
// @route  POST /user
// @access Private
const createNewUserHandler = expressAsyncHandler(
  async (
    request: CreateNewUserRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    const { userSchema } = request.body;
    const { email, address, username } = userSchema;
    const { province, state } = address;

    // both state and province cannot be undefined (one is required)
    if (!state && !province) {
      response.status(400).json({
        message: "State or province is required",
        resourceData: [],
      });
      return;
    }

    // check for duplicate email
    const isDuplicateEmail = await checkEmailExistsService({ email: { $in: [email] } });
    if (isDuplicateEmail) {
      response.status(409).json({ message: "Email already exists", resourceData: [] });
      return;
    }

    // check for duplicate username
    const isDuplicateUser = await checkUsernameExistsService({
      username: {
        $in: [username],
      },
    });
    if (isDuplicateUser) {
      response.status(409).json({ message: "Username already exists", resourceData: [] });
      return;
    }

    // create new user if all checks pass successfully
    const userDocument = await createNewUserService(userSchema);
    if (!userDocument) {
      response.status(400).json({ message: "User creation failed", resourceData: [] });
      return;
    }

    // add new username and email to usernameEmailSet collection
    const updatedUsernameEmailSet = await Promise.all([
      updateUsernameEmailSetWithUsernameService(username),
      updateUsernameEmailSetWithEmailService(email),
    ]);
    if (updatedUsernameEmailSet.some((value) => !value)) {
      response.status(400).json({ message: "User creation failed", resourceData: [] });
      return;
    }

    response.status(201).json({
      message: `User ${username} created successfully`,
      resourceData: [userDocument],
    });
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
        message: "No users were found",
        resourceData: [],
      });
      return;
    }

    console.log("users directory", users);

    response.status(200).json({
      message: "Successfully found users",
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

    const { filter, projection, options } =
      request.query as QueryObjectParsedWithDefaults;

    // only perform a countDocuments scan if a new query is being made
    if (newQueryFlag) {
      totalDocuments = await getQueriedTotalUsersService({
        filter: filter as FilterQuery<UserDocument> | undefined,
      });
    }

    // get all users
    const users = await getQueriedUsersService({
      filter: filter as FilterQuery<UserDocument> | undefined,
      projection: projection as QueryOptions<UserDocument>,
      options: options as QueryOptions<UserDocument>,
    });
    if (!users.length) {
      response.status(200).json({
        message: "No users that match query parameters were found",
        pages: 0,
        totalDocuments: 0,
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully found users",
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
      response.status(404).json({ message: "User not found.", resourceData: [] });
      return;
    }

    response
      .status(200)
      .json({ message: "Successfully found user data!", resourceData: [user] });
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
    const { userToBeDeletedId } = request.params;

    if (!userToBeDeletedId) {
      response
        .status(400)
        .json({ message: "userToBeDeletedId is required", resourceData: [] });
      return;
    }

    // delete user if all checks pass successfully
    const deletedUser = await deleteUserService(userToBeDeletedId);

    if (!deletedUser.acknowledged) {
      response.status(400).json({
        message: "Failed to delete user. Please try again!",
        resourceData: [],
      });
      return;
    }

    response
      .status(200)
      .json({ message: "Successfully deleted user!", resourceData: [] });
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
      documentUpdate: { fields, updateOperator },
    } = request.body;
    const { userToBeUpdatedId } = request.params;

    const updatedUser = await updateUserByIdService({
      fields,
      updateOperator,
      _id: userToBeUpdatedId,
    });

    if (!updatedUser) {
      response.status(400).json({ message: "User update failed", resourceData: [] });
      return;
    }

    if (!updatedUser) {
      response.status(400).json({ message: "User update failed", resourceData: [] });
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
      response
        .status(400)
        .json({ message: "Current password is incorrect", resourceData: [] });
      return;
    }

    // check if new password is the same as current password
    if (currentPassword === newPassword) {
      response.status(400).json({
        message: "New password cannot be the same as current password",
        resourceData: [],
      });
      return;
    }

    // update user password if all checks pass successfully
    const updatedUser = await updateUserPasswordService({
      userId,
      newPassword,
    });

    if (!updatedUser) {
      response.status(400).json({ message: "Password update failed", resourceData: [] });
      return;
    }

    response.status(200).json({
      message: "Password updated successfully",
      resourceData: [updatedUser],
    });
  }
);

// @desc   Delete all users
// @route  DELETE /api/v1/user/delete-all
// @access Private
const deleteAllUsersHandler = expressAsyncHandler(
  async (
    request: DeleteUserRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    const deletedUser = await deleteAllUsersService();

    if (!deletedUser.acknowledged) {
      response.status(400).json({
        message: "Failed to delete user. Please try again!",
        resourceData: [],
      });
      return;
    }

    response
      .status(200)
      .json({ message: "Successfully deleted user!", resourceData: [] });
  }
);

// DEV ROUTE
// @desc   create new users in bulk
// @route  POST /api/v1/user/dev
// @access Private
const createNewUsersBulkHandler = expressAsyncHandler(
  async (
    request: CreateNewUsersBulkRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    const { userSchemas } = request.body;

    const userDocuments = await Promise.all(
      userSchemas.map(async (userSchema) => {
        const { email, address, username } = userSchema;
        const { province, state } = address;

        // both state and province cannot be undefined (one is required)
        if (!state && !province) {
          response.status(400).json({
            message: "State or Province is required",
            resourceData: [],
          });
          return;
        }

        // check for duplicate email
        const isDuplicateEmail = await checkEmailExistsService({
          email: { $in: [email] },
        });
        if (isDuplicateEmail) {
          response
            .status(409)
            .json({ message: "Email already exists", resourceData: [] });
          return;
        }

        // check for duplicate username
        const isDuplicateUser = await checkUsernameExistsService({
          username: {
            $in: [username],
          },
        });
        if (isDuplicateUser) {
          response
            .status(409)
            .json({ message: "Username already exists", resourceData: [] });
          return;
        }

        // create new user if all checks pass successfully
        const userDocument: UserDocument = await createNewUserService(userSchema);

        // add new username and email to usernameEmailSet collection
        const updatedUsernameEmailSet = await Promise.all([
          updateUsernameEmailSetWithUsernameService(username),
          updateUsernameEmailSetWithEmailService(email),
        ]);
        if (updatedUsernameEmailSet.some((value) => !value)) {
          response
            .status(400)
            .json({ message: "User creation failed", resourceData: [] });
          return;
        }

        return userDocument;
      })
    );

    // filter out undefined values
    const userDocumentsFiltered = userDocuments.filter(removeUndefinedAndNullValues);

    // check if any users were created
    if (userDocumentsFiltered.length === userSchemas.length) {
      response.status(201).json({
        message: `Successfully created ${userDocumentsFiltered.length} users`,
        resourceData: userDocumentsFiltered,
      });
    } else {
      response.status(400).json({
        message: `Successfully created ${
          userDocumentsFiltered.length
        } user(s), but failed to create ${
          userSchemas.length - userDocumentsFiltered.length
        } user(s)`,
        resourceData: userDocumentsFiltered,
      });
    }
  }
);

// DEV ROUTE
// @desc   Update user fields in bulk
// @route  PATCH /api/v1/user/dev
// @access Private
const updateUserFieldsBulkHandler = expressAsyncHandler(
  async (
    request: UpdateUserFieldsBulkRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    const { userFields } = request.body;

    const updatedUsers = await Promise.all(
      userFields.map(async (userField) => {
        const {
          userId,
          documentUpdate: { fields, updateOperator },
        } = userField;

        const updatedUser = await updateUserByIdService({
          fields,
          updateOperator,
          _id: userId,
        });

        return updatedUser;
      })
    );

    // filter out undefined values
    const updatedUsersFiltered = updatedUsers.filter(removeUndefinedAndNullValues);

    // check if any users were updated
    if (updatedUsersFiltered.length === userFields.length) {
      response.status(201).json({
        message: `Successfully updated ${updatedUsersFiltered.length} users`,
        resourceData: updatedUsersFiltered,
      });
    } else {
      response.status(400).json({
        message: `Successfully updated ${
          updatedUsersFiltered.length
        } user(s), but failed to update ${
          userFields.length - updatedUsersFiltered.length
        } user(s)`,
        resourceData: updatedUsersFiltered,
      });
    }
  }
);

// DEV ROUTE
// @desc   get all users bulk (no filter, projection or options)
// @route  GET /api/v1/user/dev
// @access Private
const getAllUsersBulkHandler = expressAsyncHandler(
  async (
    request: GetAllUsersBulkRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>
  ) => {
    const users = await getAllUsersService();

    if (!users.length) {
      response.status(200).json({
        message: "Unable to find any users. Please try again!",
        resourceData: [],
      });
      return;
    }

    response.status(200).json({
      message: "Successfully found users!",
      resourceData: users,
    });
  }
);

export {
  createNewUserHandler,
  createNewUsersBulkHandler,
  deleteUserHandler,
  getAllUsersBulkHandler,
  getQueriedUsersHandler,
  getUserByIdHandler,
  getUsersDirectoryHandler,
  updateUserByIdHandler,
  updateUserFieldsBulkHandler,
  updateUserPasswordHandler,
  deleteAllUsersHandler,
};
