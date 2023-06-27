import { Router } from 'express';

import type { verifyJWTMiddleware } from '../../../../middlewares';

const refermentRouter = Router();

refermentRouter.route('/').get().post().delete();

refermentRouter.route('/user').get();

refermentRouter.route('/:refermentId').get().delete().put();

export { refermentRouter };
