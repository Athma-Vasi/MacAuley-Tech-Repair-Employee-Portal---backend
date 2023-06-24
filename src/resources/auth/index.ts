/**
 * This index file is used to import and export auth resources.
 */

/**
 * Import all the auth resources.
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
 * Export all the auth resources.
 */
export { authRouter, loginUserHandler, logoutUserHandler, refreshTokenHandler };
export type {
  LoginUserRequest,
  LogoutUserRequest,
  RefreshTokenRequest,
  RequestAfterJWTVerification,
};
