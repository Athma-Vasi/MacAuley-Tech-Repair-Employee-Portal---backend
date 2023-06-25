import { Router } from 'express';

import { verifyJWTMiddleware } from '../../middlewares';

import { actionsGeneralRouter } from './general';

const actionsRouter = Router();

// verifyJWT middleware is applied to all routes in this router
actionsRouter.use(verifyJWTMiddleware);

actionsRouter.use('/general', actionsGeneralRouter);

export { actionsRouter };
