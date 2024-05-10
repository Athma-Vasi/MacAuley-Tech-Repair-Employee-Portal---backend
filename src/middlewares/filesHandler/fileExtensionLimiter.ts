import path from "path";

import type { NextFunction, Request, Response } from "express";
import { FileUploadObject } from "../../types";
import createHttpError from "http-errors";

// creates a closure that takes in an array of allowed file extensions and returns a middleware function
const fileExtensionLimiterMiddleware = (allowedExtensionsArray: string[]) => {
  return (request: Request, response: Response, next: NextFunction) => {
    // this middleware only runs if filesPayloadExistsMiddleware and fileSizeLimiterMiddleware has passed - files cannot be undefined
    const files = request.files as unknown as FileUploadObject | FileUploadObject[];

    const filesWithDisallowedExtensions: FileUploadObject[] = [];

    Object.entries(files).forEach((file: [string, FileUploadObject]) => {
      const [_, fileObj] = file;
      const fileExtension = path.extname(fileObj.name);
      if (!allowedExtensionsArray.includes(fileExtension)) {
        filesWithDisallowedExtensions.push(fileObj);
      }
    });

    console.log("\n");
    console.group("fileExtensionLimiterMiddleware");
    console.log({ files });
    console.log({ filesWithDisallowedExtensions });
    console.groupEnd();

    if (filesWithDisallowedExtensions.length > 0) {
      const progressiveApostrophe = filesWithDisallowedExtensions.length > 1 ? "'s" : " ";
      const properVerb = filesWithDisallowedExtensions.length > 1 ? " are" : "is";

      const message = `Upload failed. The following file ${progressiveApostrophe}${properVerb} not allowed: ${filesWithDisallowedExtensions
        .map((file) => file.name)
        .join(", ")}. Allowed extensions are: ${allowedExtensionsArray.join(", ")}`;

      return next(new createHttpError.UnprocessableEntity(message));
    }

    return next();
  };
};

export { fileExtensionLimiterMiddleware };
