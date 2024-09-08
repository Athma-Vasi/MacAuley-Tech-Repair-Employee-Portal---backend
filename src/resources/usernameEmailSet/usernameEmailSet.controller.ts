import type { Request, Response } from "express";

import { Model } from "mongoose";
import { HttpResult } from "../../types";
import {
  createAndNotReturnResourceService,
  getResourceByFieldService,
} from "../../services";
import { createNewErrorLogService } from "../errorLog";
import {
  createErrorLogSchema,
  createHttpResultError,
  createHttpResultSuccess,
} from "../../utils";

type PostUsernameEmailSetRequest = Request & {
  body: {
    schema: {
      username: string[];
      email: string[];
    };
  };
};

// @desc   create usernameEmailSet document
// @route  POST /api/v1/username-email-set
// @access Public
/**
 * @description only runs once to create the document (only one document exists in collection)
 */
function postUsernameEmailSetHandler<
  Doc extends Record<string, unknown> = Record<string, unknown>,
>(model: Model<Doc>) {
  return async (
    request: PostUsernameEmailSetRequest,
    response: Response<HttpResult>,
  ) => {
    try {
      const { schema } = request.body;

      const resourceCreationResult = await createAndNotReturnResourceService(
        schema,
        model,
      );

      if (resourceCreationResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(
            resourceCreationResult.val,
            request.body,
          ),
        );

        response.status(200).json(
          createHttpResultError({ status: 400 }),
        );
        return;
      }

      response.status(200).json(
        createHttpResultSuccess({
          data: [resourceCreationResult.safeUnwrap()],
        }),
      );
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

type CheckUsernameOrEmailExistsRequest = Request & {
  body: {
    fields: { email?: string; username?: string };
  };
};

// @desc   check if username or email exists
// @route  POST /api/v1/username-email-set/check
// @access Public
function checkUsernameOrEmailExistsHandler<
  Doc extends Record<string, unknown> = Record<string, unknown>,
>(model: Model<Doc>) {
  return async (
    request: CheckUsernameOrEmailExistsRequest,
    response: Response<HttpResult<boolean>>,
  ) => {
    try {
      const { email, username } = request.body.fields;

      const filter = email
        ? { email: { $in: [email] } }
        : { username: { $in: [username] } };

      const isUsernameOrEmailExistsResult = await getResourceByFieldService({
        filter,
        model,
      });

      if (isUsernameOrEmailExistsResult.err) {
        await createNewErrorLogService(
          createErrorLogSchema(
            isUsernameOrEmailExistsResult.val,
            request.body,
          ),
        );

        response.status(200).json(
          createHttpResultError({ status: 400 }),
        );
        return;
      }

      response.status(200).json(
        createHttpResultSuccess({
          data: [
            isUsernameOrEmailExistsResult.safeUnwrap().status === 200,
          ],
        }),
      );
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

export { checkUsernameOrEmailExistsHandler, postUsernameEmailSetHandler };
