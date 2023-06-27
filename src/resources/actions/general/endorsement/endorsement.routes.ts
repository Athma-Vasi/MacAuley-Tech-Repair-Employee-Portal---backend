import { Router } from 'express';

import {
  createNewEndorsementHandler,
  deleteEndorsementHandler,
  deleteAllEndorsementsHandler,
  getAllEndorsementsHandler,
  getAnEndorsementHandler,
  getEndorsementsByUserHandler,
  updateAnEndorsementHandler,
} from './endorsement.controller';

const endorsementRouter = Router();

endorsementRouter
  .route('/')
  .get(getAllEndorsementsHandler)
  .post(createNewEndorsementHandler)
  .delete(deleteAllEndorsementsHandler);

endorsementRouter.route('/user').get(getEndorsementsByUserHandler);

endorsementRouter
  .route('/:endorsementId')
  .get(getAnEndorsementHandler)
  .delete(deleteEndorsementHandler)
  .put(updateAnEndorsementHandler);

export { endorsementRouter };
