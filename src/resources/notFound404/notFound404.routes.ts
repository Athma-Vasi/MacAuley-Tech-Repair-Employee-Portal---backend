import { Router, Request, Response } from 'express';
import path from 'path';

const notFoundRouter = Router();

notFoundRouter.get('*', (request: Request, response: Response) => {
  response.status(404);

  if (request.accepts('html')) {
    response.sendFile(path.join(__dirname, '..', 'views', '404.html'));
  } else if (request.accepts('json')) {
    response.json({ message: '404 Not Found' });
  } else {
    response.type('txt').send('404 Not Found');
  }
});

export { notFoundRouter };
