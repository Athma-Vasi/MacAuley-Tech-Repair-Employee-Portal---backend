import { Router } from 'express';

import {
  createNewRefermentHandler,
  deleteARefermentHandler,
  deleteAllRefermentsHandler,
  getARefermentHandler,
  getAllRefermentsHandler,
  getRefermentsByUserHandler,
  updateARefermentHandler,
} from './referment.controller';

const refermentRouter = Router();

refermentRouter
  .route('/')
  .get(getAllRefermentsHandler)
  .post(createNewRefermentHandler)
  .delete(deleteAllRefermentsHandler);

refermentRouter.route('/user').get(getRefermentsByUserHandler);

refermentRouter
  .route('/:refermentId')
  .get(getARefermentHandler)
  .delete(deleteARefermentHandler)
  .put(updateARefermentHandler);

export { refermentRouter };
