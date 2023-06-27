import { Router } from 'express';

import {
  createNewRefermentHandler,
  deleteARefermentHandler,
  deleteAllRefermentsHandler,
} from './referment.controller';

const refermentRouter = Router();

refermentRouter.route('/').get().post(createNewRefermentHandler).delete(deleteAllRefermentsHandler);

refermentRouter.route('/user').get();

refermentRouter.route('/:refermentId').get().delete(deleteARefermentHandler).put();

export { refermentRouter };
