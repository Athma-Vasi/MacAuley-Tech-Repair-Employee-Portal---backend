import { Router } from 'express';

import {
  createNewEndorsementHandler,
  deleteEndorsementHandler,
  getAllEndorsementsHandler,
  getAnEndorsementHandler,
  getEndorsementsByUserHandler,
} from './endorsement.controller';

const endorsementRouter = Router();

endorsementRouter.route('/').get(getAllEndorsementsHandler).post(createNewEndorsementHandler);

endorsementRouter.route('/user').get(getEndorsementsByUserHandler);

endorsementRouter
  .route('/:endorsementId')
  .get(getAnEndorsementHandler)
  .delete(deleteEndorsementHandler);

export { endorsementRouter };
