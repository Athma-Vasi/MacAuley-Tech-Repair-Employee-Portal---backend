import expressAsyncController from "express-async-handler";

import type { NextFunction, Response } from "express";
import type {
  CreateNewUserRequest,
  CreateNewUsersBulkRequest,
  DeleteUserRequest,
  GetAllUsersBulkRequest,
  GetAllUsersRequest,
  GetUserByIdRequest,
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
  updateUserByIdService,
  updateUserPasswordService,
} from "./user.service";
import { UserDocument } from "./user.model";
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
import createHttpError from "http-errors";

// @desc   Create new user
// @route  POST /user
// @access Private
const createNewUserController = expressAsyncController(
  async (
    request: CreateNewUserRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>,
    next: NextFunction
  ) => {
    const { userSchema } = request.body;
    const { email, address, username } = userSchema;
    const { province, state } = address;

    if (!state && !province) {
      return next(new createHttpError.BadRequest("State or Province is required"));
    }

    const isDuplicateEmail = await checkEmailExistsService({ email: { $in: [email] } });
    if (isDuplicateEmail) {
      return next(new createHttpError.Conflict("Email already exists"));
    }

    const isDuplicateUser = await checkUsernameExistsService({
      username: {
        $in: [username],
      },
    });
    if (isDuplicateUser) {
      return next(new createHttpError.Conflict("Username already exists"));
    }

    const userDocument = await createNewUserService(userSchema);
    if (!userDocument) {
      return next(new createHttpError.InternalServerError("User creation failed"));
    }

    const updatedUsernameEmailSet = await Promise.all([
      updateUsernameEmailSetWithUsernameService(username),
      updateUsernameEmailSetWithEmailService(email),
    ]);
    if (updatedUsernameEmailSet.some((value) => !value)) {
      return next(new createHttpError.InternalServerError("User creation failed"));
    }

    response.status(201).json({
      message: `User ${username} created successfully`,
      resourceData: [userDocument],
    });
  }
);

// @desc   Get all users
// @route  GET /user
// @access Private
const getQueriedUsersController = expressAsyncController(
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
const getUserByIdController = expressAsyncController(
  async (
    request: GetUserByIdRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>,
    next: NextFunction
  ) => {
    const { userId } = request.params;

    const user = await getUserByIdService(userId);
    if (!user) {
      return next(new createHttpError.NotFound("User not found"));
    }

    response
      .status(200)
      .json({ message: "Successfully found user data!", resourceData: [user] });
  }
);

// @desc   Delete a user
// @route  DELETE /user
// @access Private
const deleteUserController = expressAsyncController(
  async (
    request: DeleteUserRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>,
    next: NextFunction
  ) => {
    const { userToBeDeletedId } = request.params;
    if (!userToBeDeletedId) {
      return next(new createHttpError.BadRequest("User ID is required"));
    }

    const deletedUser = await deleteUserService(userToBeDeletedId);
    if (!deletedUser.acknowledged) {
      return next(new createHttpError.InternalServerError("Failed to delete user"));
    }

    response
      .status(200)
      .json({ message: "Successfully deleted user!", resourceData: [] });
  }
);

// @desc   Update a user
// @route  PATCH /user
// @access Private
const updateUserByIdController = expressAsyncController(
  async (
    request: UpdateUserRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>,
    next: NextFunction
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
      return next(new createHttpError.InternalServerError("User update failed"));
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
const updateUserPasswordController = expressAsyncController(
  async (
    request: UpdateUserPasswordRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>,
    next: NextFunction
  ) => {
    const {
      userInfo: { userId },
      currentPassword,
      newPassword,
    } = request.body;

    const isCurrentPasswordCorrect = await checkUserPasswordService({
      userId,
      password: currentPassword,
    });

    if (!isCurrentPasswordCorrect) {
      return next(new createHttpError.BadRequest("Current password is incorrect"));
    }

    if (currentPassword === newPassword) {
      return next(
        new createHttpError.BadRequest(
          "New password cannot be the same as the current password"
        )
      );
    }

    const updatedUser = await updateUserPasswordService({
      userId,
      newPassword,
    });

    if (!updatedUser) {
      return next(new createHttpError.InternalServerError("Password update failed"));
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
const deleteAllUsersController = expressAsyncController(
  async (
    _request: DeleteUserRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>,
    next: NextFunction
  ) => {
    const deletedUsers = await deleteAllUsersService();
    if (!deletedUsers.deletedCount) {
      return next(new createHttpError.InternalServerError("Failed to delete all users"));
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
const createNewUsersBulkController = expressAsyncController(
  async (
    request: CreateNewUsersBulkRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>,
    next: NextFunction
  ) => {
    const { userSchemas } = request.body;

    const userDocuments = await Promise.all(
      userSchemas.map(async (userSchema) => {
        const { email, address, username } = userSchema;
        const { province, state } = address;

        if (!state && !province) {
          response.status(400).json({
            message: "State or Province is required",
            resourceData: [],
          });
          return;
        }

        const isDuplicateEmail = await checkEmailExistsService({
          email: { $in: [email] },
        });
        if (isDuplicateEmail) {
          response
            .status(409)
            .json({ message: "Email already exists", resourceData: [] });
          return;
        }

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

        const userDocument: UserDocument = await createNewUserService(userSchema);

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

    const userDocumentsFiltered = userDocuments.filter(removeUndefinedAndNullValues);

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
const updateUserFieldsBulkController = expressAsyncController(
  async (
    request: UpdateUserFieldsBulkRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>,
    next: NextFunction
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

    const updatedUsersFiltered = updatedUsers.filter(removeUndefinedAndNullValues);

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
const getAllUsersBulkController = expressAsyncController(
  async (
    request: GetAllUsersBulkRequest,
    response: Response<ResourceRequestServerResponse<UserDocument>>,
    next: NextFunction
  ) => {
    const users = await getAllUsersService();

    if (!users.length) {
      response.status(200).json({
        message: "Unable to find any users",
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
  createNewUserController,
  createNewUsersBulkController,
  deleteUserController,
  getAllUsersBulkController,
  getQueriedUsersController,
  getUserByIdController,
  updateUserByIdController,
  updateUserFieldsBulkController,
  updateUserPasswordController,
  deleteAllUsersController,
};
