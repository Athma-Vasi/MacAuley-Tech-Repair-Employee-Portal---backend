import { Router } from 'express';
import {
  createNewAnonymousRequestHandler,
  deleteAllAnonymousRequestsHandler,
  deleteAnAnonymousRequestHandler,
  getQueriedAnonymousRequestsHandler,
  getAnAnonymousRequestHandler,
} from './anonymousRequest.controller';

const anonymousRequestRouter = Router();

anonymousRequestRouter
  .route('/')
  .get(getQueriedAnonymousRequestsHandler)
  .post(createNewAnonymousRequestHandler)
  .delete(deleteAllAnonymousRequestsHandler);

anonymousRequestRouter
  .route('/:anonymousRequestId')
  .get(getAnAnonymousRequestHandler)
  .delete(deleteAnAnonymousRequestHandler);

export { anonymousRequestRouter };
