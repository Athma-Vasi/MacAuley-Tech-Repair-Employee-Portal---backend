import { format } from 'date-fns';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';

type LogEventsInput = {
  message: string;
  logFileName: string;
};

/**
 * Logs events to a file. The log file is stored in the logs directory.
 * @param param0 LogEventsInput - { message: string, logFileName: string}
 * @param param0.message string - the message to be logged
 * @param param0.logFileName string - the name of the log file
 * @returns Promise:void
 */
async function logEvents({ message, logFileName }: LogEventsInput): Promise<void> {
  const dateTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`;
  const logItem = `${dateTime}\t${uuidV4()}\t${message}\n`;

  const logDirPath = path.join(__dirname, '..', 'logs');
  const logFilePath = path.join(__dirname, '..', 'logs', logFileName);

  try {
    // Check if the log directory exists and create it if it doesn't
    if (!fs.existsSync(logDirPath)) {
      await fsPromises.mkdir(logDirPath);
    }

    // Check if the log file exists and create it if it doesn't
    // If the file exists, append the log item to it
    await fsPromises.appendFile(logFilePath, logItem);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Middleware that logs all requests to a file. The log file is stored in the logs directory.
 */
function loggerMiddleware(request: Request, response: Response, next: NextFunction) {
  // TODO: only log events that are not from allowListed origins
  logEvents({
    message: `${request.method}\t${request.url}\t${request.headers.origin}\t`,
    logFileName: 'requestsLog.log',
  });

  console.log(`${request.method} \t ${request.path}`);

  next();
}

export { logEvents, loggerMiddleware };
