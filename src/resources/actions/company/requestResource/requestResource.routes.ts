import { Router } from 'express';
import {
  createNewRequestResourceHandler,
  deleteARequestResourceHandler,
  deleteAllRequestResourcesHandler,
  getQueriedRequestResourcesHandler,
  getRequestResourceByIdHandler,
  getRequestResourceByUserHandler,
} from './requestResource.controller';

const requestResourceRouter = Router();

requestResourceRouter
  .route('/')
  .get(getQueriedRequestResourcesHandler)
  .post(createNewRequestResourceHandler)
  .delete(deleteAllRequestResourcesHandler);

requestResourceRouter
  .route('/:requestResourceId')
  .get(getRequestResourceByIdHandler)
  .delete(deleteARequestResourceHandler);

requestResourceRouter.route('/user').get(getRequestResourceByUserHandler);

export { requestResourceRouter };
