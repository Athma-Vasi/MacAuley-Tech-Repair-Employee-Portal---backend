/**
 * This barrel file is used to import/export auth model, router, types, handlers and services
 */

/**
 * Imports
 */
import { authRouter } from "./auth.routes";
import { loginUserHandler, logoutUserHandler } from "./auth.handler";

import type {
  LoginUserRequest,
  LogoutUserRequest,
  RefreshTokenRequest,
  TokenDecoded,
} from "./auth.types";

/**
 * Exports
 */
export { authRouter, loginUserHandler, logoutUserHandler };
export type {
  LoginUserRequest,
  LogoutUserRequest,
  RefreshTokenRequest,
  TokenDecoded,
};
