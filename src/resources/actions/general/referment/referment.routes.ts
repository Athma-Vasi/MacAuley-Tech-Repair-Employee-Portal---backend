import { Router } from 'express';

import {
  createNewRefermentHandler,
  deleteARefermentHandler,
  deleteAllRefermentsHandler,
  getARefermentByIdHandler,
  getQueriedRefermentsHandler,
  getQueriedRefermentsByUserHandler,
  updateRefermentStatusByIdHandler,
  createNewRefermentsBulkHandler,
} from './referment.controller';
import { assignQueryDefaults, verifyRoles } from '../../../../middlewares';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../constants';

const refermentRouter = Router();

refermentRouter.use(verifyRoles());

refermentRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedRefermentsHandler)
  .post(createNewRefermentHandler)
  .delete(deleteAllRefermentsHandler);

refermentRouter.route('/user').get(getQueriedRefermentsByUserHandler);

// DEV ROUTE
refermentRouter.route('/dev').post(createNewRefermentsBulkHandler);

refermentRouter
  .route('/:refermentId')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getARefermentByIdHandler)
  .delete(deleteARefermentHandler)
  .patch(updateRefermentStatusByIdHandler);

export { refermentRouter };
