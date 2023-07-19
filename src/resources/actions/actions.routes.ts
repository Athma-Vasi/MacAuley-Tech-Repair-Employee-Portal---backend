import { Router } from 'express';

import { assignQueryDefaults, verifyJWTMiddleware } from '../../middlewares';
import { actionsGeneralRouter } from './general';
import { actionsCompanyRouter } from './company';
import { actionsOutreachRouter } from './outreach';
import { FIND_QUERY_OPTIONS_KEYWORDS } from '../../constants';

const actionsRouter = Router();

// verify JWT middleware that returns (upon success) the decoded JWT, which is the userInfo object that is added to the request body
actionsRouter.use(verifyJWTMiddleware);
actionsRouter.use(assignQueryDefaults(FIND_QUERY_OPTIONS_KEYWORDS));

actionsRouter.use('/company', actionsCompanyRouter);
actionsRouter.use('/general', actionsGeneralRouter);
actionsRouter.use('/outreach', actionsOutreachRouter);

export { actionsRouter };
