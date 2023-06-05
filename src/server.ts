import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import path from 'path';

import { config } from './config';
import { connectDB } from './config/connectDB';
import { corsOptions } from './config/cors';
import { errorHandler } from './middlewares';
import { logEvents, loggerMiddleware } from './middlewares';
import { notFoundRouter } from './routes';
import { rootRouter } from './routes';

const { PORT } = config;

const app = express();

// connect to MongoDB
connectDB(config);

app.use(loggerMiddleware);
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', rootRouter);

app.all('*', notFoundRouter);

// error handling
app.use(errorHandler);

//
//
//
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on('error', (error) => {
  console.error(error);

  logEvents({
    message: `${error.no}:${error.code}\t${error.syscall}\t${error.hostname}`,
    logFileName: 'mongoErrorLog.log',
  });
});
