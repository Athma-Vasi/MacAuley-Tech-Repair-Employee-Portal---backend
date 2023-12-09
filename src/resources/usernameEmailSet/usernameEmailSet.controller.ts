import expressAsyncHandler from "express-async-handler";

import type { Response } from "express";

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

// @desc   create usernameEmailSet document
// @route  POST /api/v1/username-email-set
// @access Public
/**
 * @description only runs once to create the document (only one document exists in collection)
 */
const postUsernameEmailSetHandler = expressAsyncHandler(
  async (
    request: PostUsernameEmailSetRequest,
    response: Response<UsernameEmailSetResponse>
  ) => {
    const { username, email } = request.body;

    const usernameEmailSet = await createUsernameEmailSetService({
      username,
      email,
    });

    if (!usernameEmailSet) {
      response.status(400).json({
        status: "error",
        message: "UsernameEmailSet not created",
      });
      return;
    }

    response.status(201).json({
      status: "success",
      message: "UsernameEmailSet created successfully",
    });
  }
);

// @desc   check if username or email exists
// @route  GET /api/v1/username-email-set
// @access Public
const checkUsernameEmailExistsHandler = expressAsyncHandler(
  async (
    request: GetUsernameEmailExistsRequest,
    response: Response<UsernameEmailSetResponse>
  ) => {
    const { email, username } = request.body.fields;

    const filter = email
      ? { $in: { email: [email] } }
      : { $in: { username: [username] } };

    const isUsernameOrEmailExists = email
      ? await checkEmailExistsService(filter as Record<"$in", { email: string[] }>)
      : await checkUsernameExistsService(filter as Record<"$in", { username: string[] }>);

    if (isUsernameOrEmailExists) {
      response.status(200).json({
        status: "error",
        message: "Username or email already exists",
      });
      return;
    }

    response.status(200).json({
      status: "success",
      message: "Username or email does not exist",
    });
  }
);

export { checkUsernameEmailExistsHandler, postUsernameEmailSetHandler };
