import { CookieOptions, NextFunction, Request, Response } from "express";

import { config } from "../config";
import { DecodedToken } from "../resources/auth/auth.types";

import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  TRIGGER_LOGOUT_KEY,
} from "../constants";
import { createTokenService } from "../resources/auth/auth.service";
import { verifyJWTSafe } from "../utils";

async function verifyJWTMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { ACCESS_TOKEN_SEED, REFRESH_TOKEN_SEED } = config;
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };
  const propertyDescriptor: PropertyDescriptor = {
    value: "",
    writable: false,
    enumerable: true,
    configurable: true,
  };

  const accessToken = request.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    response.clearCookie("refreshToken", cookieOptions);
    return next(
      new Error(TRIGGER_LOGOUT_KEY, { cause: "Access token not found" }),
    );
  }

  const { refreshToken } = request.cookies;
  if (!refreshToken) {
    response.clearCookie("refreshToken", cookieOptions);
    return next(
      new Error(TRIGGER_LOGOUT_KEY, { cause: "Refresh token not found" }),
    );
  }

  // check if refresh token is valid
  const decodedRefreshTokenResult = await verifyJWTSafe({
    seed: REFRESH_TOKEN_SEED,
    token: refreshToken,
  });

  // check if access token is valid
  const decodedAccessTokenResult = await verifyJWTSafe({
    seed: ACCESS_TOKEN_SEED,
    token: accessToken,
  });

  // if refresh token is invalid (except for expired)
  if (decodedRefreshTokenResult.err) {
    response.clearCookie("refreshToken", cookieOptions);
    return next(
      new Error(TRIGGER_LOGOUT_KEY, { cause: "Refresh token invalid" }),
    );
  }

  const refreshDecodedToken = decodedRefreshTokenResult.safeUnwrap()
    .data as DecodedToken;

  // if access token is invalid (except for expired)
  if (decodedAccessTokenResult.err) {
    response.clearCookie("refreshToken", cookieOptions);
    return next(
      new Error(TRIGGER_LOGOUT_KEY, { cause: "Access token invalid" }),
    );
  }

  // if refresh token is valid and expired
  // create tokens and set cookie and continue to next middleware
  if (decodedRefreshTokenResult.safeUnwrap().kind === "error") {
    const refreshTokenResult = await createTokenService({
      decoded: refreshDecodedToken,
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      request,
      seed: REFRESH_TOKEN_SEED,
    });

    if (refreshTokenResult.err) {
      response.clearCookie("refreshToken", cookieOptions);
      return next(
        new Error(TRIGGER_LOGOUT_KEY, {
          cause: "Error refreshing refresh token",
        }),
      );
    }

    const newRefreshToken = refreshTokenResult.safeUnwrap().data;

    if (!newRefreshToken) {
      response.clearCookie("refreshToken", cookieOptions);
      return next(
        new Error(TRIGGER_LOGOUT_KEY, {
          cause: "Error refreshing refresh token",
        }),
      );
    }

    response.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 12, // cookie expires in 12 hours
    });

    const accessTokenResult = await createTokenService({
      decoded: refreshDecodedToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      request,
      seed: ACCESS_TOKEN_SEED,
    });

    if (accessTokenResult.err) {
      response.clearCookie("refreshToken", cookieOptions);
      return next(
        new Error(TRIGGER_LOGOUT_KEY, { cause: "Error refreshing tokens" }),
      );
    }

    const newAccessToken = accessTokenResult.safeUnwrap().data;

    if (!newAccessToken) {
      response.clearCookie("refreshToken", cookieOptions);
      return next(
        new Error(TRIGGER_LOGOUT_KEY, { cause: "Error refreshing tokens" }),
      );
    }

    Object.defineProperty(request.body, "accessToken", {
      value: newAccessToken,
      ...propertyDescriptor,
    });

    return next();
  }

  // as refresh token is now valid and not expired,
  // check if access token is expired
  if (decodedAccessTokenResult.safeUnwrap().kind === "error") {
    const accessTokenResult = await createTokenService({
      decoded: refreshDecodedToken,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      request,
      seed: ACCESS_TOKEN_SEED,
    });

    if (accessTokenResult.err) {
      response.clearCookie("refreshToken", cookieOptions);
      return next(
        new Error(TRIGGER_LOGOUT_KEY, { cause: "Error refreshing tokens" }),
      );
    }

    const newAccessToken = accessTokenResult.safeUnwrap().data;

    if (!newAccessToken) {
      response.clearCookie("refreshToken", cookieOptions);
      return next(
        new Error(TRIGGER_LOGOUT_KEY, { cause: "Error refreshing tokens" }),
      );
    }

    Object.defineProperty(request.body, "accessToken", {
      value: newAccessToken,
      ...propertyDescriptor,
    });
  }

  Object.defineProperty(request.body, "userInfo", {
    value: decodedAccessTokenResult.safeUnwrap().data?.userInfo,
    ...propertyDescriptor,
  });

  Object.defineProperty(request.body, "sessionId", {
    value: decodedAccessTokenResult.safeUnwrap().data?.sessionId,
    ...propertyDescriptor,
  });

  return next();
}

export { verifyJWTMiddleware };
