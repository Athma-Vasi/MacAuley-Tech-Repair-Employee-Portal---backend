import { Router } from 'express';
import {
  createNewAddressChangeHandler,
  getAllAddressChangesHandler,
  getAddressChangesByUserHandler,
  getAnAddressChangeHandler,
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
  .get(getAnAddressChangeHandler)
  .delete(deleteAnAddressChangeHandler);

export { addressChangeRouter };
