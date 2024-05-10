/**
 * This barrel file is used to import/export auth model, router, types, handlers and services
 */

/**
 * Imports
 */
import { authRouter } from "./auth.routes";
import {
  loginUserController,
  logoutUserController,
  refreshTokenController,
} from "./auth.controller";

import type {
  LoginUserRequest,
  LogoutUserRequest,
  RefreshTokenRequest,
  RequestAfterJWTVerification,
} from "./auth.types";

/**
 * Exports
 */
export { authRouter, loginUserController, logoutUserController, refreshTokenController };
export type {
  LoginUserRequest,
  LogoutUserRequest,
  RefreshTokenRequest,
  RequestAfterJWTVerification,
};
