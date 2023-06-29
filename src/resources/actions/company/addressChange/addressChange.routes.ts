import { Router } from 'express';
import {
  createNewAddressChangeHandler,
  getAllAddressChangesHandler,
  getAddressChangesByUserHandler,
  getAddressChangeByIdHandler,
  deleteAnAddressChangeHandler,
  deleteAllAddressChangesHandler,
} from './addressChange.controller';

const addressChangeRouter = Router();

addressChangeRouter
  .route('/')
  .get(getAllAddressChangesHandler)
  .post(createNewAddressChangeHandler)
  .delete(deleteAllAddressChangesHandler);

addressChangeRouter.route('/user').get(getAddressChangesByUserHandler);

addressChangeRouter
  .route('/:addressChangeId')
  .get(getAddressChangeByIdHandler)
  .delete(deleteAnAddressChangeHandler);

export { addressChangeRouter };
