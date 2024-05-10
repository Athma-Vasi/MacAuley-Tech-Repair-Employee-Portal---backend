import { NextFunction, Request, Response } from "express";
import { allowedOrigins } from "../config/cors";

function credentials(request: Request, response: Response, next: NextFunction) {
  const { origin = "" } = request.headers;

  if (allowedOrigins.includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Access-Control-Allow-Credentials", "true");
  }

  return next();
}

export { credentials };
