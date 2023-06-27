import { Router } from 'express';

import {
  createNewRefermentHandler,
  deleteARefermentHandler,
  deleteAllRefermentsHandler,
  getAllRefermentsHandler,
} from './referment.controller';

const refermentRouter = Router();

refermentRouter
  .route('/')
  .get(getAllRefermentsHandler)
  .post(createNewRefermentHandler)
  .delete(deleteAllRefermentsHandler);

refermentRouter.route('/user').get();

refermentRouter.route('/:refermentId').get().delete(deleteARefermentHandler).put();

export { refermentRouter };
