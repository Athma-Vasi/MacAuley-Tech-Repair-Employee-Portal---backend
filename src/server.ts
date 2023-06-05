import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'path';

import { CorsOptions } from 'cors';

import { config } from './config';
import { corsOptions } from './config/cors';
import { errorHandler } from './middlewares/errorHandler';
import { loggerMiddleware } from './middlewares/logger';
import { notFoundRouter } from './routes/404';
import { rootRouter } from './routes/root';

const { PORT } = config;

const app = express();

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
