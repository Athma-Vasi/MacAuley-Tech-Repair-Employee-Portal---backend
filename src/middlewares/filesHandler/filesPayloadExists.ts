import { NextFunction, Request, Response } from "express";
import { FileUploadObject } from "../../types";
import createHttpError from "http-errors";

function filesPayloadExistsMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const files = request.files as FileUploadObject | FileUploadObject[] | undefined;

  if (!files || (Array.isArray(files) && files.length === 0)) {
    return next(new createHttpError.BadRequest("No files found in request object"));
  }

  console.log("\n");
  console.group("filesPayloadExistsMiddleware");
  console.log({ files });
  console.groupEnd();

  return next();
}

export { filesPayloadExistsMiddleware };
