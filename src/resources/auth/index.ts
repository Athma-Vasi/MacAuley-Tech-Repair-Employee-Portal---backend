/**
 * This index file is used to import/export auth model, router, types, handlers and services
 */

/**
 * Imports
 */
import { authRouter } from './auth.routes';
import { loginUserHandler, logoutUserHandler, refreshTokenHandler } from './auth.controller';

import type {
  LoginUserRequest,
  LogoutUserRequest,
  RefreshTokenRequest,
  RequestAfterJWTVerification,
} from './auth.types';

/**
 * Exports
 */
export { authRouter, loginUserHandler, logoutUserHandler, refreshTokenHandler };
export type {
  LoginUserRequest,
  LogoutUserRequest,
  RefreshTokenRequest,
  RequestAfterJWTVerification,
};
