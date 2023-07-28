import { Router } from 'express';
import {
  createNewAddressChangeHandler,
  getQueriedAddressChangesHandler,
  getAddressChangesByUserHandler,
  getAddressChangeByIdHandler,
  deleteAnAddressChangeHandler,
  deleteAllAddressChangesHandler,
  updateAddressChangeStatusByIdHandler,
} from './addressChange.controller';
import { assignQueryDefaults, verifyRoles } from '../../../../middlewares';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../constants';

const addressChangeRouter = Router();

addressChangeRouter.use(verifyRoles());

addressChangeRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedAddressChangesHandler)
  .post(createNewAddressChangeHandler)
  .delete(deleteAllAddressChangesHandler);

addressChangeRouter.route('/user').get(getAddressChangesByUserHandler);

addressChangeRouter
  .route('/:addressChangeId')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getAddressChangeByIdHandler)
  .delete(deleteAnAddressChangeHandler)
  .patch(updateAddressChangeStatusByIdHandler);

export { addressChangeRouter };
