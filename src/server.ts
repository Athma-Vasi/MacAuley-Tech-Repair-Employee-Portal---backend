import express from 'express';
import path from 'path';

import { config } from './config';
import { rootRouter } from './routes/root';
import { notFoundRouter } from './routes/404';
import { loggerMiddleware } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';

const { PORT } = config;

const app = express();

app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
