import { Router } from 'express';

import {
  createNewEventHandler,
  deleteAllEventsByUserHandler,
  deleteAnEventHandler,
  getAllEventsHandler,
  getEventByIdHandler,
  getEventsByUserHandler,
  updateAnEventHandler,
} from './eventCreator.controller';

const eventCreatorRouter = Router();

eventCreatorRouter.route('/').post(createNewEventHandler).get(getAllEventsHandler);

eventCreatorRouter
  .route('/:eventId')
  .get(getEventByIdHandler)
  .delete(deleteAnEventHandler)
  .put(updateAnEventHandler);

eventCreatorRouter.route('/user').get(getEventsByUserHandler).delete(deleteAllEventsByUserHandler);

export { eventCreatorRouter };
