import { Router } from 'express';
import { endorsementRouter } from './endorsement';
import { printerIssueRouter } from './printerIssue';
import { anonymousRequestRouter } from './anonymousRequest';
import { refermentRouter } from './referment';

const actionsGeneralRouter = Router();

actionsGeneralRouter.use('/endorsements', endorsementRouter);
actionsGeneralRouter.use('/printer-issues', printerIssueRouter);
actionsGeneralRouter.use('/anonymous-requests', anonymousRequestRouter);
actionsGeneralRouter.use('/referments', refermentRouter);

export { actionsGeneralRouter };
