import rateLimit from 'express-rate-limit';

import { logEvents } from './logger';

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 5 minutes',
  handler: (request, response, next, options) => {
    logEvents({
      message: `Too many requests: ${request.ip}\t${request.method}\t${request.originalUrl}\t${request.headers.origin}\t${options.message.message}`,
      logFileName: 'loginLimitLog.log',
    });

    response.status(options.statusCode).json(options.message);

    next();
  },
  standardHeaders: true, // return rate limit info in headers
  legacyHeaders: false, // disable X-RateLimit headers
});

export { loginLimiter };
