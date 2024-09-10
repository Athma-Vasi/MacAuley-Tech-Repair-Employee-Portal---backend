import { Router } from "express";

import { loginLimiter, verifyJWTMiddleware } from "../../middlewares";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createAuthSessionJoiSchema } from "./auth.validation";
import { loginUserHandler, logoutUserHandler } from "./auth.handler";
import { AuthModel } from "./auth.model";

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

// @desc   Logout user
// @route  POST /auth/logout
// @access Private
authRouter.route("/logout").post(
  verifyJWTMiddleware,
  logoutUserHandler(AuthModel),
);

export { authRouter };
