import { Router } from 'express';

import type { verifyJWTMiddleware } from '../../../../middlewares';

import { createNewRefermentHandler, deleteARefermentHandler } from './referment.controller';

const refermentRouter = Router();

refermentRouter.route('/').get().post(createNewRefermentHandler).delete();

refermentRouter.route('/user').get();

refermentRouter.route('/:refermentId').get().delete(deleteARefermentHandler).put();

export { refermentRouter };
