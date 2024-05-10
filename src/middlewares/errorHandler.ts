import { NextFunction, Request, Response } from "express";
import { ErrorLogSchema } from "../resources/errorLog/errorLog.model";
import { createNewErrorLogService } from "../resources/errorLog/errorLog.service";

function errorHandler(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { message, status, stack } = error;
  const { body } = request;
  const {
    userInfo: { userId, username },
    sessionId,
  } = body;

  Promise.resolve()
    .then(async () => {
      const errorLogSchema: ErrorLogSchema = {
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
      // response.status(error.status ?? 500);
      // response.json({
      //   message: error.message ?? "Internal Server Error",
      // });
      response.status(document.status ?? 500).json({
        message: document.message ?? "Internal Server Error",
      });
      return;
    });
}

export { errorHandler };

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
