import { Router, Request, Response } from 'express';
import path from 'path';

const rootRouter = Router();

rootRouter.get('^/$|/index(.html)?', (request: Request, response: Response) => {
  response.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

export { rootRouter };
