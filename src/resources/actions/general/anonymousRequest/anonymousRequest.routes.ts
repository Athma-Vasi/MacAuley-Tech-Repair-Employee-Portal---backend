import { Router } from 'express';
import {
  createNewAnonymousRequestHandler,
  deleteAllAnonymousRequestsHandler,
  deleteAnAnonymousRequestHandler,
  getQueriedAnonymousRequestsHandler,
  getAnAnonymousRequestHandler,
  updateAnonymousRequestStatusByIdHandler,
} from './anonymousRequest.controller';

const anonymousRequestRouter = Router();

// no roles verification for anonymous requests

anonymousRequestRouter
  .route('/')
  .get(getQueriedAnonymousRequestsHandler)
  .post(createNewAnonymousRequestHandler)
  .delete(deleteAllAnonymousRequestsHandler);

anonymousRequestRouter
  .route('/:anonymousRequestId')
  .get(getAnAnonymousRequestHandler)
  .delete(deleteAnAnonymousRequestHandler)
  .patch(updateAnonymousRequestStatusByIdHandler);

export { anonymousRequestRouter };
