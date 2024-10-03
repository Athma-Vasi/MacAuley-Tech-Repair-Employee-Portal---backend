import { NextFunction, Request, Response } from "express";

import { config } from "../config";
import { PROPERTY_DESCRIPTOR } from "../constants";
import { DecodedToken } from "../resources/auth";
import { createHttpResultError, verifyJWTSafe } from "../utils";

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

  const decodedAccessTokenUnwrapped = decodedAccessTokenResult.safeUnwrap();
  const decodedAccessToken = decodedAccessTokenUnwrapped.data as
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

  // if access token is valid and expired
  if (decodedAccessTokenUnwrapped.kind === "error") {
    response.status(200).json(
      createHttpResultError({
        isTokenExpired: true,
        message: "Access token expired",
      }),
    );

    return;
  }

  Object.defineProperty(request.body, "accessToken", {
    value: accessToken,
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

// async function verifyJWTMiddleware(
//   request: Request,
//   response: Response,
//   next: NextFunction,
// ) {
//   const { ACCESS_TOKEN_SEED, REFRESH_TOKEN_SEED } = config;
//   const PROPERTY_DESCRIPTOR: PropertyDescriptor = {
//     writable: true,
//     enumerable: true,
//     configurable: true,
//   };

//   const authorizationTokens = request.headers.authorization?.split(" ");
//   const [_, accessToken, refreshToken] = authorizationTokens || [];

//   console.group("verifyJWTMiddleware");
//   console.log("accessToken:", accessToken);
//   console.log("refreshToken:", refreshToken);

//   if (!accessToken) {
//     return next(
//       new Error(TRIGGER_LOGOUT_KEY, { cause: "Access token not found" }),
//     );
//   }

//   if (!refreshToken) {
//     return next(
//       new Error(TRIGGER_LOGOUT_KEY, { cause: "Refresh token not found" }),
//     );
//   }

//   // check if refresh token is valid
//   const decodedRefreshTokenResult = await verifyJWTSafe({
//     seed: REFRESH_TOKEN_SEED,
//     token: refreshToken,
//   });

//   // if refresh token is invalid (except for expired)
//   if (decodedRefreshTokenResult.err) {
//     return next(
//       new Error(TRIGGER_LOGOUT_KEY, { cause: "Refresh token invalid" }),
//     );
//   }

//   // const refreshDecodedToken = decodedRefreshTokenResult.safeUnwrap()
//   //   .data as DecodedToken;
//   const refreshDecodedTokenUnwrapped = decodedRefreshTokenResult.safeUnwrap();
//   const refreshDecodedToken = refreshDecodedTokenUnwrapped.data as
//     | DecodedToken
//     | undefined;

//   if (refreshDecodedToken === undefined) {
//     return next(
//       new Error(TRIGGER_LOGOUT_KEY, { cause: "Refresh token invalid" }),
//     );
//   }

//   // check if access token is valid
//   const decodedAccessTokenResult = await verifyJWTSafe({
//     seed: ACCESS_TOKEN_SEED,
//     token: accessToken,
//   });

//   // if access token is invalid (except for expired)
//   if (decodedAccessTokenResult.err) {
//     return next(
//       new Error(TRIGGER_LOGOUT_KEY, { cause: "Access token invalid" }),
//     );
//   }

//   const decodedAccessTokenUnwrapped = decodedAccessTokenResult.safeUnwrap();
//   const decodedAccessToken = decodedAccessTokenUnwrapped.data as
//     | DecodedToken
//     | undefined;

//   if (decodedAccessToken === undefined) {
//     return next(
//       new Error(TRIGGER_LOGOUT_KEY, { cause: "Access token invalid" }),
//     );
//   }

//   // if refresh token is valid and expired
//   // create tokens and continue to next middleware
//   if (refreshDecodedTokenUnwrapped.kind === "error") {
//     const refreshTokenResult = await createTokenService({
//       decoded: refreshDecodedToken,
//       expiresIn: REFRESH_TOKEN_EXPIRES_IN,
//       request,
//       seed: REFRESH_TOKEN_SEED,
//     });

//     if (refreshTokenResult.err) {
//       return next(
//         new Error(TRIGGER_LOGOUT_KEY, {
//           cause: "Error refreshing refresh token",
//         }),
//       );
//     }

//     const newRefreshToken = refreshTokenResult.safeUnwrap().data;

//     if (newRefreshToken === undefined) {
//       return next(
//         new Error(TRIGGER_LOGOUT_KEY, {
//           cause: "Error refreshing refresh token",
//         }),
//       );
//     }

//     Object.defineProperty(request.body, "refreshToken", {
//       value: newRefreshToken,
//       ...PROPERTY_DESCRIPTOR,
//     });

//     const accessTokenResult = await createTokenService({
//       decoded: decodedAccessToken,
//       expiresIn: ACCESS_TOKEN_EXPIRES_IN,
//       request,
//       seed: ACCESS_TOKEN_SEED,
//     });

//     if (accessTokenResult.err) {
//       return next(
//         new Error(TRIGGER_LOGOUT_KEY, {
//           cause: "Error refreshing access token",
//         }),
//       );
//     }

//     const newAccessToken = accessTokenResult.safeUnwrap().data;

//     if (newAccessToken === undefined) {
//       return next(
//         new Error(TRIGGER_LOGOUT_KEY, { cause: "Error refreshing tokens" }),
//       );
//     }

//     Object.defineProperty(request.body, "accessToken", {
//       value: newAccessToken,
//       ...PROPERTY_DESCRIPTOR,
//     });

//     return next();
//   }

//   // as refresh token is now valid and not expired, it is reused
//   // check if access token is expired
//   if (decodedAccessTokenUnwrapped.kind === "error") {
//     const accessTokenResult = await createTokenService({
//       decoded: decodedAccessToken,
//       expiresIn: ACCESS_TOKEN_EXPIRES_IN,
//       request,
//       seed: ACCESS_TOKEN_SEED,
//     });

//     if (accessTokenResult.err) {
//       return next(
//         new Error(TRIGGER_LOGOUT_KEY, {
//           cause: "Error refreshing access token",
//         }),
//       );
//     }

//     const newAccessToken = accessTokenResult.safeUnwrap().data;

//     if (newAccessToken === undefined) {
//       return next(
//         new Error(TRIGGER_LOGOUT_KEY, { cause: "Error refreshing tokens" }),
//       );
//     }

//     Object.defineProperty(request.body, "refreshToken", {
//       value: refreshToken,
//       ...PROPERTY_DESCRIPTOR,
//     });

//     Object.defineProperty(request.body, "accessToken", {
//       value: newAccessToken,
//       ...PROPERTY_DESCRIPTOR,
//     });

//     return next();
//   }

//   // if refresh and access tokens are valid and not expired
//   // add tokens and continue to next middleware
//   Object.defineProperty(request.body, "refreshToken", {
//     value: refreshToken,
//     ...PROPERTY_DESCRIPTOR,
//   });

//   Object.defineProperty(request.body, "accessToken", {
//     value: accessToken,
//     ...PROPERTY_DESCRIPTOR,
//   });

//   Object.defineProperty(request.body, "userInfo", {
//     value: decodedAccessTokenResult.safeUnwrap().data?.userInfo,
//     ...PROPERTY_DESCRIPTOR,
//   });

//   Object.defineProperty(request.body, "sessionId", {
//     value: decodedAccessTokenResult.safeUnwrap().data?.sessionId,
//     ...PROPERTY_DESCRIPTOR,
//   });

//   return next();
// }

export { verifyJWTMiddleware };
