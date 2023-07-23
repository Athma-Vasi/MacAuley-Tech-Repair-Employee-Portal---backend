import { Router } from 'express';

import {
  createNewEventHandler,
  deleteAllEventsByUserHandler,
  deleteAnEventHandler,
  getQueriedEventsHandler,
  getEventByIdHandler,
  getQueriedEventsByUserHandler,
  updateAnEventHandler,
} from './eventCreator.controller';
import { assignQueryDefaults, verifyRoles } from '../../../../middlewares';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../../../constants';

const eventCreatorRouter = Router();

eventCreatorRouter.use(verifyRoles());

eventCreatorRouter
  .route('/')
  .post(createNewEventHandler)
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedEventsHandler);

eventCreatorRouter
  .route('/user')
  .get(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS), getQueriedEventsByUserHandler)
  .delete(deleteAllEventsByUserHandler);

eventCreatorRouter
  .route('/:eventId')
  .get(getEventByIdHandler)
  .delete(deleteAnEventHandler)
  .put(updateAnEventHandler);

export { eventCreatorRouter };
