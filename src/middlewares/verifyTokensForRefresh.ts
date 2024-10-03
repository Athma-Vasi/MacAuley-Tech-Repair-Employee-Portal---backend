import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import { PROPERTY_DESCRIPTOR } from "../constants";
import { DecodedToken } from "../resources/auth";
import { createHttpResultError, verifyJWTSafe } from "../utils";

async function verifyTokensForRefresh(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const [_, accessToken, refreshToken] =
        request.headers.authorization?.split(" ") || [];

    if (!accessToken) {
        response.status(200).json(
            createHttpResultError({
                message: "Access token not found",
                triggerLogout: true,
            }),
        );

        return;
    }

    if (!refreshToken) {
        response.status(200).json(
            createHttpResultError({
                message: "Refresh token not found",
                triggerLogout: true,
            }),
        );

        return;
    }

    const { ACCESS_TOKEN_SEED, REFRESH_TOKEN_SEED } = config;

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
    const accessDecodedToken = decodedAccessTokenUnwrapped.data as
        | DecodedToken
        | undefined;

    if (accessDecodedToken === undefined) {
        response.status(200).json(
            createHttpResultError({
                message: "Error decoding access token",
                triggerLogout: true,
            }),
        );

        return;
    }

    const decodedRefreshTokenResult = await verifyJWTSafe({
        seed: REFRESH_TOKEN_SEED,
        token: refreshToken,
    });

    // token is invalid (except for expired)
    if (decodedRefreshTokenResult.err) {
        response.status(200).json(
            createHttpResultError({
                message: "Refresh token invalid",
                triggerLogout: true,
            }),
        );

        return;
    }

    const decodedRefreshTokenUnwrapped = decodedRefreshTokenResult.safeUnwrap();
    const refreshDecodedToken = decodedRefreshTokenUnwrapped.data as
        | DecodedToken
        | undefined;

    if (refreshDecodedToken === undefined) {
        response.status(200).json(
            createHttpResultError({
                message: "Error decoding refresh token",
                triggerLogout: true,
            }),
        );

        return;
    }

    // both tokens are valid

    Object.defineProperty(request.body, "decodedToken", {
        value: accessDecodedToken,
        ...PROPERTY_DESCRIPTOR,
    });

    next();
    return;
}

export { verifyTokensForRefresh };
