import { Router } from "express";

import { loginLimiter, verifyJWTMiddleware } from "../../middlewares";
import { validateSchemaMiddleware } from "../../middlewares/validateSchema";
import { createAuthSessionJoiSchema } from "./auth.validation";
import { loginUserHandler, logoutUserHandler } from "./auth.handler";
import { AuthModel } from "./auth.model";

const authRouter = Router();

// TODO: ADD LOGIN LIMITER FOR PRODUCTION
// authRouter.route('/login').post(loginLimiter, loginUserController);
authRouter.route("/login").post(
  validateSchemaMiddleware(createAuthSessionJoiSchema, "schema"),
  loginUserHandler(AuthModel),
);

authRouter.route("/logout").post(
  verifyJWTMiddleware,
  logoutUserHandler(AuthModel),
);

export { authRouter };
