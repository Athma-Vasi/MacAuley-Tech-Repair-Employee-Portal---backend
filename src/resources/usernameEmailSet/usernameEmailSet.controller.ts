import expressAsyncController from "express-async-handler";

import type { NextFunction, Response } from "express";

import {
  checkEmailExistsService,
  checkUsernameExistsService,
  createUsernameEmailSetService,
} from "./usernameEmailSet.service";
import {
  GetUsernameEmailExistsRequest,
  PostUsernameEmailSetRequest,
  UsernameEmailSetResponse,
} from "./usernameEmailSet.types";
import createHttpError from "http-errors";

// @desc   create usernameEmailSet document
// @route  POST /api/v1/username-email-set
// @access Public
/**
 * @description only runs once to create the document (only one document exists in collection)
 */
const postUsernameEmailSetController = expressAsyncController(
  async (
    request: PostUsernameEmailSetRequest,
    response: Response<UsernameEmailSetResponse>,
    next: NextFunction
  ) => {
    const { username, email } = request.body;

    const usernameEmailSet = await createUsernameEmailSetService({
      username,
      email,
    });

    if (!usernameEmailSet) {
      return next(
        new createHttpError.InternalServerError("UsernameEmailSet not created")
      );
    }

    response.status(201).json({
      status: "success",
      message: "UsernameEmailSet created successfully",
    });
  }
);

// @desc   check if username or email exists
// @route  POST /api/v1/username-email-set/check
// @access Public
const checkUsernameEmailExistsController = expressAsyncController(
  async (
    request: GetUsernameEmailExistsRequest,
    response: Response<UsernameEmailSetResponse>,
    next: NextFunction
  ) => {
    const { email, username } = request.body.fields;

    const filter = email
      ? { email: { $in: [email] } }
      : { username: { $in: [username] } };

    const isUsernameOrEmailExists = email
      ? await checkEmailExistsService(filter as { email: { $in: string[] } })
      : await checkUsernameExistsService(filter as { username: { $in: string[] } });

    if (isUsernameOrEmailExists) {
      response.status(200).json({
        status: "error",
        message: `${email ? "Email" : "Username"} already exists.`,
      });
      return;
    }

    response.status(200).json({
      status: "success",
      message: `${email ? "Email" : "Username"} does not exist.`,
    });
  }
);

export { checkUsernameEmailExistsController, postUsernameEmailSetController };
