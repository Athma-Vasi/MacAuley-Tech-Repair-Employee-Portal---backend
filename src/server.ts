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
import { errorHandler, logEvents, loggerMiddleware } from './middlewares';

import { noteRouter } from './resources/note';
import { userRouter } from './resources/user';
import { rootRouter } from './resources/root';
import { notFoundRouter } from './resources/notFound404';
import { authRouter } from './resources/auth';
import { actionsRouter } from './resources/actions';
import { fileUploadRouter } from './resources/fileUpload';
import { commentRouter } from './resources/comment';

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
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/notes', noteRouter);
app.use('/actions', actionsRouter);
app.use('/file-uploads', fileUploadRouter);
app.use('/comments', commentRouter);

app.all('*', notFoundRouter);

// error handling
app.use(errorHandler);

/**
 *
 *
 *
 */

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');

  const { PORT } = config;
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
