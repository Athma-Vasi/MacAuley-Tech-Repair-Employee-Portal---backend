import { NextFunction, Request, Response } from "express";

import { config } from "../config";
import { ACCESS_TOKEN_EXPIRES_IN, PROPERTY_DESCRIPTOR } from "../constants";
import { createTokenService } from "../resources/auth/auth.service";
import { DecodedToken } from "../types";
import { createHttpResultError, decodeJWTSafe, verifyJWTSafe } from "../utils";

async function verifyJWTMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const { ACCESS_TOKEN_SEED } = config;

  const [_, accessToken] = request.headers.authorization?.split(" ") || [];
  if (!accessToken) {
    response.status(200).json(
      createHttpResultError({
        message: "Access token not found",
        triggerLogout: true,
      }),
    );

    return;
  }

  const decodedAccessTokenResult = await verifyJWTSafe({
    seed: ACCESS_TOKEN_SEED,
    token: accessToken,
  });

  // token is invalid (except for expired)
  if (decodedAccessTokenResult.err) {
    response.status(200).json(
      createHttpResultError({
        message: "Access token invalid",
        triggerLogout: true,
      }),
    );

    return;
  }

  console.log(`\n`);
  console.group("verifyJWTMiddleware");
  console.log("decodedAccessTokenResult:", decodedAccessTokenResult);
  console.groupEnd();

  // token is now valid and maybe expired
  // as verification throws error if invalid, token is (now safely) decoded
  const safeDecodedResult = await decodeJWTSafe(accessToken);

  if (safeDecodedResult.err) {
    response.status(200).json(
      createHttpResultError({
        message: "Error decoding access token",
        triggerLogout: true,
      }),
    );

    return;
  }

  const decodedAccessToken = safeDecodedResult.safeUnwrap().data as
    | DecodedToken
    | undefined;

  if (decodedAccessToken === undefined) {
    response.status(200).json(
      createHttpResultError({
        message: "Error decoding access token",
        triggerLogout: true,
      }),
    );

    return;
  }

  // regardless of expiry, create new access token
  // and invalidate the old one

  const tokenCreationResult = await createTokenService({
    decodedOldToken: decodedAccessToken,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    invalidateOldToken: true,
    request,
    seed: ACCESS_TOKEN_SEED,
  });

  if (tokenCreationResult.err) {
    response.status(200).json(
      createHttpResultError({
        message: "Error creating access token",
        triggerLogout: true,
      }),
    );

    return;
  }

  const newAccessToken = tokenCreationResult.safeUnwrap().data;

  if (newAccessToken === undefined) {
    response.status(200).json(
      createHttpResultError({
        message: "Error creating access token",
        triggerLogout: true,
      }),
    );

    return;
  }

  Object.defineProperty(request.body, "accessToken", {
    value: newAccessToken,
    ...PROPERTY_DESCRIPTOR,
  });

  Object.defineProperty(request.body, "userInfo", {
    value: decodedAccessToken.userInfo,
    ...PROPERTY_DESCRIPTOR,
  });

  Object.defineProperty(request.body, "sessionId", {
    value: decodedAccessToken.sessionId,
    ...PROPERTY_DESCRIPTOR,
  });

  next();
  return;
}

export { verifyJWTMiddleware };
