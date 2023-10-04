import { Router } from 'express';

import {
  createNewEndorsementHandler,
  deleteEndorsementHandler,
  deleteAllEndorsementsHandler,
  getQueriedEndorsementsHandler,
  getAnEndorsementHandler,
  getQueriedEndorsementsByUserHandler,
  updateAnEndorsementHandler,
  createNewEndorsementsBulkHandler,
} from './endorsement.controller';
import { assignQueryDefaults, verifyRoles } from '../../../../middlewares';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../constants';

const endorsementRouter = Router();

endorsementRouter.use(verifyRoles());

endorsementRouter
  .route('/')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedEndorsementsHandler)
  .post(createNewEndorsementHandler)
  .delete(deleteAllEndorsementsHandler);

endorsementRouter.route('/user').get(getQueriedEndorsementsByUserHandler);

// DEV ROUTE
endorsementRouter.route('/dev').post(createNewEndorsementsBulkHandler);

endorsementRouter
  .route('/:endorsementId')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getAnEndorsementHandler)
  .delete(deleteEndorsementHandler)
  .patch(updateAnEndorsementHandler);

export { endorsementRouter };
