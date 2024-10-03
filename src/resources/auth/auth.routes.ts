import { Router } from "express";

import { verifyJWTMiddleware } from "../../middlewares";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import {
  loginUserHandler,
  logoutUserHandler,
  refreshTokensHandler,
  registerUserHandler,
} from "./auth.handler";
import { AuthModel } from "./auth.model";
import { createAuthSessionJoiSchema } from "./auth.validation";

const authRouter = Router();

// TODO: ADD LOGIN LIMITER FOR PRODUCTION
// authRouter.route('/login').post(loginLimiter, loginUserController);

// @desc   Login user
// @route  POST /auth/login
// @access Public
authRouter.route("/login").post(
  validateSchemaMiddleware(createAuthSessionJoiSchema, "schema"),
  loginUserHandler(AuthModel),
);

// @desc   Refresh token
// @route  POST /auth/refresh
// @access Private
authRouter.route("/refresh").post(
  verifyJWTMiddleware,
  refreshTokensHandler(AuthModel),
);

// @desc   Register user
// @route  POST /auth/register
// @access Public
authRouter.route("/register").post(
  validateSchemaMiddleware(createAuthSessionJoiSchema, "schema"),
  registerUserHandler(AuthModel),
);

// @desc   Logout user
// @route  POST /auth/logout
// @access Private
authRouter.route("/logout").post(
  verifyJWTMiddleware,
  logoutUserHandler(AuthModel),
);

export { authRouter };
