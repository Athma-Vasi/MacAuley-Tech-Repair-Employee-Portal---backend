import { Router } from "express";

import { loginLimiter } from "../../middlewares";
import {
  loginUserController,
  logoutUserController,
  refreshTokenController,
} from "../auth/auth.controller";

const authRouter = Router();

// ADD LOGIN LIMITER FOR PRODUCTION
// authRouter.route('/login').post(loginLimiter, loginUserController);
authRouter.route("/login").post(loginUserController);

authRouter.route("/refresh").post(refreshTokenController);

authRouter.route("/logout").post(logoutUserController);

export { authRouter };
