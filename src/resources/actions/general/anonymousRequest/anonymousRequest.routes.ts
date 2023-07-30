import { Router } from 'express';
import {
  createNewAnonymousRequestHandler,
  deleteAllAnonymousRequestsHandler,
  deleteAnAnonymousRequestHandler,
  getQueriedAnonymousRequestsHandler,
  getAnAnonymousRequestHandler,
  updateAnonymousRequestStatusByIdHandler,
} from './anonymousRequest.controller';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../constants';
import { assignQueryDefaults } from '../../../../middlewares';

const anonymousRequestRouter = Router();

// no roles verification for anonymous requests

anonymousRequestRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedAnonymousRequestsHandler)
  .post(createNewAnonymousRequestHandler)
  .delete(deleteAllAnonymousRequestsHandler);

anonymousRequestRouter
  .route('/:anonymousRequestId')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getAnAnonymousRequestHandler)
  .delete(deleteAnAnonymousRequestHandler)
  .patch(updateAnonymousRequestStatusByIdHandler);

export { anonymousRequestRouter };
