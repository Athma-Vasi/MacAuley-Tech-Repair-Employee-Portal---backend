/**
 * This barrel file is used to import/export auth model, router, types, handlers and services
 */

/**
 * Imports
 */
import { loginUserHandler, logoutUserHandler } from "./auth.handler";
import { authRouter } from "./auth.routes";

import type {
  DecodedToken,
  LoginUserRequest,
  LogoutUserRequest,
  RefreshTokenRequest,
} from "./auth.types";

/**
 * Exports
 */
export { authRouter, loginUserHandler, logoutUserHandler };
export type {
  DecodedToken,
  LoginUserRequest,
  LogoutUserRequest,
  RefreshTokenRequest,
};
