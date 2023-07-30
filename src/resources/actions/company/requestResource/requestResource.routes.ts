import { Router } from 'express';
import {
  createNewRequestResourceHandler,
  deleteARequestResourceHandler,
  deleteAllRequestResourcesHandler,
  getQueriedRequestResourcesHandler,
  getRequestResourceByIdHandler,
  getRequestResourceByUserHandler,
  updateRequestResourceStatusByIdHandler,
} from './requestResource.controller';
import { assignQueryDefaults, verifyRoles } from '../../../../middlewares';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../constants';

const requestResourceRouter = Router();

requestResourceRouter.use(verifyRoles());

requestResourceRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedRequestResourcesHandler)
  .post(createNewRequestResourceHandler)
  .delete(deleteAllRequestResourcesHandler);

requestResourceRouter
  .route('/user')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getRequestResourceByUserHandler);

requestResourceRouter
  .route('/:requestResourceId')
  .get(getRequestResourceByIdHandler)
  .delete(deleteARequestResourceHandler)
  .patch(updateRequestResourceStatusByIdHandler);

export { requestResourceRouter };
