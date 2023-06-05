import { NextFunction, Request, Response } from 'express';

import { logEvents } from './logger';

// this errorHandler will override default express error handling
function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
  logEvents({
    message: `${error.name}:${error.message}\t${request.method}\t${request.url}\t${request.headers.origin}\t`,
    logFileName: 'errorsLog.log',
  });

  console.error(error.stack);

  const status = response.statusCode ? response.statusCode : 500;
  response.status(status);
  response.json({
    status,
    message: error.message,
  });
}

export { errorHandler };
