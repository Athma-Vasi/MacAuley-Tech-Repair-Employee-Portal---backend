import type { Response } from "express";

import { UserDocument, UserModel } from "./user.model";

import { Model } from "mongoose";
import { CreateNewResourceRequest, HttpResult } from "../../types";
import {
  createNewResourceService,
  getResourceByFieldService,
} from "../../services";
import { createNewErrorLogService } from "../errorLog";
import { createErrorLogSchema, createHttpResultError } from "../../utils";

// @desc   Create new user
// @route  POST /api/v1/user
// @access Private
function createNewUserHandler<
  Doc extends Record<string, unknown> = Record<string, unknown>,
>(model: Model<Doc>) {
  return async (
    request: CreateNewResourceRequest<Doc>,
    response: Response<HttpResult<UserDocument>>,
  ) => {
    try {
      const { schema } = request.body;

      const usernameExistsResult = await getResourceByFieldService({
        field: "username",
        value: schema.username,
        model,
      });

      if (usernameExistsResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(
            usernameExistsResult.val,
            request.body,
          ),
        );

        response.status(200).json(createHttpResultError({}));
        return;
      }

      if (usernameExistsResult.val.status === 200) {
        response.status(200).json(
          createHttpResultError({ message: "Username already exists" }),
        );
        return;
      }

      const emailExistsResult = await getResourceByFieldService({
        field: "email",
        value: schema.email,
        model,
      });

      if (emailExistsResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(
            emailExistsResult.val,
            request.body,
          ),
        );

        response.status(200).json(createHttpResultError({}));
        return;
      }

      if (emailExistsResult.val.status === 200) {
        response.status(200).json(
          createHttpResultError({ message: "Email already exists" }),
        );
        return;
      }

      const userCreationResult = await createNewResourceService(
        schema,
        UserModel,
      );

      if (userCreationResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(
            userCreationResult.val,
            request.body,
          ),
        );

        response.status(200).json(createHttpResultError({}));
        return;
      }

      response.status(201).json(userCreationResult.safeUnwrap());

      //     const updatedUsernameEmailSet = await Promise.all([
      //       updateUsernameEmailSetWithUsernameService(username),
      //       updateUsernameEmailSetWithEmailService(email),
      //     ]);
      //     if (updatedUsernameEmailSet.some((value) => !value)) {
      //       return next(
      //         new createHttpError.InternalServerError("User creation failed"),
      //       );
      //     }
    } catch (error: unknown) {
      await createNewErrorLogService(
        createErrorLogSchema(
          createHttpResultError({ data: [error] }),
          request.body,
        ),
      );

      response.status(200).json(createHttpResultError({}));
    }
  };
}

export { createNewUserHandler };
