import { NextFunction, Request, Response } from "express";
import { ErrorLogModel } from "../resources/errorLog/errorLog.model";
import { createNewResourceService } from "../services";
import { createErrorLogSchema, createHttpResultError } from "../utils";

async function errorHandler(
  error: unknown,
  request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof Error) {
    console.group("errorHandler catch all");
    console.error(error);
    console.groupEnd();

    const errorLogSchema = createErrorLogSchema(
      error,
      request.body,
    );

    await createNewResourceService(
      errorLogSchema,
      ErrorLogModel,
    );
  }

  response.status(200).json(
    createHttpResultError({
      accessToken: "",
      message: "An unknown error occurred",
    }),
  );

  return;
}

export { errorHandler };

/**
 * onst { body } = request;
  const {
    userInfo: { userId, username },
    sessionId,
  } = body;

  Promise.resolve()
    .then(async () => {
      const errorLogSchema: ErrorLogSchema = {
        expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        userId,
        username,
        sessionId,
        message,
        stack,
        requestBody: JSON.stringify(body),
        status,
        timestamp: new Date(),
      };

      const errorLogDocument = await createNewErrorLogService(errorLogSchema);
      console.group("errorHandler");
      console.log("errorLogSchema: ", errorLogSchema);
      console.log("errorLogDocument: ", errorLogDocument);
      console.groupEnd();

      return errorLogDocument;
    })
    .then((document) => {
      response.status(document.status ?? 500).json({
        message: document.message ?? "Internal Server Error",
        resourceData: document ? [document] : [],
      });
      return;
    });
 */

// import { NextFunction, Request, Response } from 'express';

// import { logEvents } from './logger';

// // this errorHandler will override default express error handling
// function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
//   logEvents({
//     message: `${error.name}:${error.message}\t${error.cause}\t${request.method}\t${request.url}\t${request.headers.origin}\t`,
//     logFileName: 'errorsLog.log',
//   });

//   console.error(error.stack);

//   const status = response.statusCode ? response.statusCode : 500;
//   response.status(status);
//   response.statusMessage = error.message ?? 'Internal Server Error';
//   response.json({
//     status,
//     message: error.message ?? 'Internal Server Error',
//   });
//   return;
// }
