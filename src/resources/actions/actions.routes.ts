import { Router } from 'express';

import { verifyJWTMiddleware } from '../../middlewares';
import { actionsGeneralRouter } from './general';
import { actionsCompanyRouter } from './company';
import { fileUploadRouter } from '../fileUpload';

const actionsRouter = Router();

// verifyJWT middleware is applied to all routes in this router
actionsRouter.use(verifyJWTMiddleware);

actionsRouter.use('/company', actionsCompanyRouter);
actionsRouter.use('/general', actionsGeneralRouter);

export { actionsRouter };
