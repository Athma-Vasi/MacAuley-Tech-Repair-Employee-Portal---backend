import { Router } from 'express';

import { verifyJWTMiddleware } from '../../middlewares';
import { actionsGeneralRouter } from './general';
import { actionsCompanyRouter } from './company';
import { actionsOutreachRouter } from './outreach';

const actionsRouter = Router();

// verify JWT middleware that returns (upon success) the decoded JWT, which is the userInfo object that is added to the request body
actionsRouter.use(verifyJWTMiddleware);

actionsRouter.use('/company', actionsCompanyRouter);
actionsRouter.use('/general', actionsGeneralRouter);
actionsRouter.use('/outreach', actionsOutreachRouter);

export { actionsRouter };
