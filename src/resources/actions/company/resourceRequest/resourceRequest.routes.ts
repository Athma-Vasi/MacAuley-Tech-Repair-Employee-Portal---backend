import { Router } from 'express';
import {
  createNewRequestResourceHandler,
  deleteARequestResourceHandler,
  deleteAllRequestResourcesHandler,
  getAllRequestResourcesHandler,
  getRequestResourceByIdHandler,
  getRequestResourceByUserHandler,
} from './resourceRequest.controller';

const requestResourceRouter = Router();

requestResourceRouter
  .route('/')
  .get(getAllRequestResourcesHandler)
  .post(createNewRequestResourceHandler)
  .delete(deleteAllRequestResourcesHandler);

requestResourceRouter
  .route('/:requestResourceId')
  .get(getRequestResourceByIdHandler)
  .delete(deleteARequestResourceHandler);

requestResourceRouter.route('/user').get(getRequestResourceByUserHandler);

export { requestResourceRouter };
