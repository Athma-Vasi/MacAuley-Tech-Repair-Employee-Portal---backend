import { Router } from 'express';
import {
  createNewAddressChangeHandler,
  getQueriedAddressChangeHandler,
  getAddressChangesByUserHandler,
  getAddressChangeByIdHandler,
  deleteAnAddressChangeHandler,
  deleteAllAddressChangesHandler,
} from './addressChange.controller';

const addressChangeRouter = Router();

addressChangeRouter
  .route('/')
  .get(getQueriedAddressChangeHandler)
  .post(createNewAddressChangeHandler)
  .delete(deleteAllAddressChangesHandler);

addressChangeRouter.route('/user').get(getAddressChangesByUserHandler);

addressChangeRouter
  .route('/:addressChangeId')
  .get(getAddressChangeByIdHandler)
  .delete(deleteAnAddressChangeHandler);

export { addressChangeRouter };
