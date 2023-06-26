import { Router } from 'express';
import {
  createNewAnonymousRequestHandler,
  deleteAllAnonymousRequestsHandler,
  deleteAnAnonymousRequestHandler,
  getAllAnonymousRequestsHandler,
  getAnAnonymousRequestHandler,
} from './anonymousRequest.controller';

const anonymousRequestRouter = Router();

anonymousRequestRouter
  .route('/')
  .get(getAllAnonymousRequestsHandler)
  .post(createNewAnonymousRequestHandler)
  .delete(deleteAllAnonymousRequestsHandler);

anonymousRequestRouter
  .route('/:anonymousRequestId')
  .get(getAnAnonymousRequestHandler)
  .delete(deleteAnAnonymousRequestHandler);

export { anonymousRequestRouter };
