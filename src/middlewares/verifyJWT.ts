import { NextFunction, Response, Request } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

import { config } from "../config";
import { AccessTokenDecoded } from "../resources/auth/auth.types";
import createHttpError from "http-errors";

function verifyJWTMiddleware(
  // technically this request object is only modified after this middleware function runs
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { ACCESS_TOKEN_SECRET } = config;

  const accessToken = request.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    response.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return next(new createHttpError.Unauthorized("No token provided"));
  }

  jwt.verify(
    accessToken,
    ACCESS_TOKEN_SECRET,
    async (error: VerifyErrors | null, decoded) => {
      if (error) {
        response.clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        return next(new createHttpError.Forbidden("Access token invalid"));
      }

      const { userInfo, sessionId } = decoded as AccessTokenDecoded;

      console.log("original request.body: ", request.body);

      const updatedRequestBody = {
        userInfo,
        sessionId,
      };

      Object.defineProperty(request, "body", {
        value: { ...request.body, ...updatedRequestBody },
        ...Object.getOwnPropertyDescriptor(request, "body"),
      });

      console.log("\n");
      console.group("verifyJWTMiddleware");
      console.log("decoded: ", decoded);
      console.log("modified request.body: ", request.body);
      console.groupEnd();

      return next();
    }
  );
}

export { verifyJWTMiddleware };
