import { NextFunction, Request, Response } from "express";
import { allowedOrigins } from "../config/cors";

function credentials(request: Request, response: Response, next: NextFunction) {
  const { origin = "" } = request.headers;

  if (allowedOrigins.includes(origin)) {
    console.group("credentials");
    console.log("origin:", origin);
    console.groupEnd();

    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    );
    response.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
  }

  return next();
}

export { credentials };
