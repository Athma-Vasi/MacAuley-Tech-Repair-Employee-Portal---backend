import { Router } from 'express';
import { endorsementRouter } from './endorsement';
import { printerIssueRouter } from './printerIssue';
import { anonymousRequestRouter } from './anonymousRequest';

const actionsGeneralRouter = Router();

actionsGeneralRouter.use('/endorsements', endorsementRouter);
actionsGeneralRouter.use('/printer-issues', printerIssueRouter);
actionsGeneralRouter.use('/anonymous-requests', anonymousRequestRouter);

export { actionsGeneralRouter };
