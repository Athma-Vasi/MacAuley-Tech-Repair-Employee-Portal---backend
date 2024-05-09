import { NextFunction, Request, Response } from "express";

function errorHandler(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.group("Error Handler Middleware");
  console.log("request body", request.body);
  console.log("error message:", error.message);
  console.log("error stack:", error.stack);
  console.log("error status", error.status);
  console.groupEnd();

  Promise.resolve()
    .then(() => {
      setTimeout(() => {
        console.log("TIMEOUT");
      }, 1000);
    })
    .then(() => {
      response.status(error.status ?? 500);
      response.json({
        message: error.message ?? "Internal Server Error",
      });
    })
    .finally(() => {
      console.log("inside finally block");
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
